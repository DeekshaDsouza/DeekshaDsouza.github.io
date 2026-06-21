import { mmModule } from './mm/module.mjs';
import { inventoryModule } from './inventory/module.mjs';
import { fiModule } from './fi/module.mjs';

export const moduleRegistry = [mmModule, inventoryModule, fiModule];

export const taskRegistry = moduleRegistry.flatMap((moduleDefinition) => (
    moduleDefinition.tasks.map((task) => ({
        ...task,
        moduleId: moduleDefinition.id,
        moduleName: moduleDefinition.label
    }))
));
