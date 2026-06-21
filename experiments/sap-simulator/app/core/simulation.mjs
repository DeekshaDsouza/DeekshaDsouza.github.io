import { createInitialState } from '../data/scenario.mjs';
import { taskRegistry } from '../modules/registry.mjs';

export function createSimulation(scenario, tasks = taskRegistry) {
    let state = createInitialState(scenario);
    const listeners = new Set();

    function getCurrentTaskDefinition() {
        return tasks[state.currentTaskIndex] ?? null;
    }

    function getSnapshot() {
        const currentTaskDefinition = getCurrentTaskDefinition();

        return {
            scenario,
            state,
            currentTask: currentTaskDefinition
                ? {
                    ...currentTaskDefinition.getView({ scenario, state }),
                    id: currentTaskDefinition.id,
                    stepLabel: currentTaskDefinition.stepLabel,
                    moduleLabel: currentTaskDefinition.moduleLabel,
                    moduleName: currentTaskDefinition.moduleName
                }
                : null,
            taskProgress: tasks.map((task, index) => ({
                id: task.id,
                label: task.stepLabel,
                moduleLabel: task.moduleLabel,
                status: index < state.currentTaskIndex
                    ? 'complete'
                    : index === state.currentTaskIndex && !state.completed
                        ? 'current'
                        : 'upcoming'
            }))
        };
    }

    function notify() {
        const snapshot = getSnapshot();
        listeners.forEach((listener) => listener(snapshot));
    }

    function submit(payload) {
        const task = getCurrentTaskDefinition();

        if (!task || state.completed) {
            return { ok: false, message: 'This scenario is already complete.' };
        }

        let result;

        try {
            result = task.execute({ scenario, state, payload });
        } catch (error) {
            console.error(error);
            result = {
                ok: false,
                message: 'The simulator could not process that step. Reset the scenario and try again.',
                fieldErrors: {}
            };
        }

        if (!result.ok) {
            state = {
                ...state,
                feedback: {
                    tone: 'error',
                    message: result.message,
                    fieldErrors: result.fieldErrors ?? {}
                }
            };
            notify();
            return result;
        }

        const nextTaskIndex = state.currentTaskIndex + 1;
        const completed = nextTaskIndex >= tasks.length;

        state = {
            ...result.state,
            currentTaskIndex: nextTaskIndex,
            completed,
            feedback: {
                tone: 'success',
                message: result.message,
                fieldErrors: {}
            }
        };

        notify();
        return { ...result, completed };
    }

    function reset() {
        state = createInitialState(scenario);
        notify();
    }

    function subscribe(listener) {
        listeners.add(listener);
        listener(getSnapshot());
        return () => listeners.delete(listener);
    }

    return {
        getSnapshot,
        reset,
        submit,
        subscribe
    };
}
