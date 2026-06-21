import { createSimulation } from './core/simulation.mjs';
import { procureToPayScenario } from './data/scenario.mjs';
import { renderApp } from './ui/render.mjs';

const root = document.querySelector('#app');
const simulation = createSimulation(procureToPayScenario);

simulation.subscribe((snapshot) => {
    renderApp(root, snapshot, {
        reset() {
            simulation.reset();
            requestAnimationFrame(() => {
                root.querySelector('#task-title')?.focus();
            });
        },
        submit(payload) {
            const result = simulation.submit(payload);
            requestAnimationFrame(() => {
                const selector = result.ok
                    ? '#task-title, #completion-title'
                    : '.feedback-banner';
                root.querySelector(selector)?.focus();
            });
        }
    });
});
