import assert from 'node:assert/strict';
import { createSimulation } from '../app/core/simulation.mjs';
import { procureToPayScenario } from '../app/data/scenario.mjs';

const simulation = createSimulation(procureToPayScenario);

assert.equal(simulation.getSnapshot().currentTask.id, 'mm.create-requisition');

assert.equal(simulation.submit({
    quantity: '20',
    deliveryDate: '2026-07-15',
    costCenter: 'OPS-410 · Customer operations'
}).ok, true);

assert.equal(simulation.getSnapshot().currentTask.id, 'mm.create-purchase-order');

const overBudgetResult = simulation.submit({ vendorId: 'western-office-tech' });
assert.equal(overBudgetResult.ok, false);
assert.match(overBudgetResult.message, /exceeds the approved budget/i);
assert.equal(simulation.getSnapshot().currentTask.id, 'mm.create-purchase-order');

assert.equal(simulation.submit({ vendorId: 'coastal-systems' }).ok, true);
assert.equal(simulation.submit({ receivedQuantity: '20', condition: 'accepted' }).ok, true);

const mismatchResult = simulation.submit({
    invoiceReference: 'INV-CS-8821',
    invoiceTotal: '1000000',
    dueDate: '2026-08-14'
});
assert.equal(mismatchResult.ok, false);
assert.match(mismatchResult.message, /three-way match/i);

assert.equal(simulation.submit({
    invoiceReference: 'INV-CS-8821',
    invoiceTotal: '1160000',
    dueDate: '2026-08-14'
}).ok, true);

assert.equal(simulation.submit({
    bankAccountId: 'operating-inr',
    approval: 'approved'
}).ok, true);

const finalSnapshot = simulation.getSnapshot();
assert.equal(finalSnapshot.state.completed, true);
assert.equal(finalSnapshot.state.documents.length, 5);
assert.equal(finalSnapshot.state.inventory.openingStock + finalSnapshot.state.inventory.receivedQuantity, 28);
assert.equal(finalSnapshot.state.finance.openPayable, 0);

console.log('Procure-to-pay simulation passed.');
