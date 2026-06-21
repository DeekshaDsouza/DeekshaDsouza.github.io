const postGoodsReceiptTask = {
    id: 'inventory.post-goods-receipt',
    stepLabel: 'Receive',
    moduleLabel: 'Inventory',

    getView({ scenario, state }) {
        return {
            role: 'Warehouse clerk',
            title: 'Post the goods receipt',
            description: `The shipment for ${state.procurement.purchaseOrder.id} has arrived at the plant.`,
            why: 'Receiving updates stock and proves that the supplier delivered. Finance will use this record when checking the invoice.',
            summary: [
                { label: 'Supplier', value: state.procurement.purchaseOrder.vendorName },
                { label: 'Ordered', value: `${state.procurement.purchaseOrder.quantity} laptops` },
                { label: 'Storage location', value: scenario.request.storageLocation }
            ],
            fields: [
                {
                    name: 'receivedQuantity',
                    label: 'Quantity received',
                    type: 'number',
                    min: 1,
                    max: state.procurement.purchaseOrder.quantity,
                    value: state.procurement.purchaseOrder.quantity,
                    help: 'Count the delivered units before posting.'
                },
                {
                    name: 'condition',
                    label: 'Delivery condition',
                    type: 'select',
                    value: 'accepted',
                    options: [
                        { value: 'accepted', label: 'Accepted — no visible damage' },
                        { value: 'hold', label: 'Place on quality hold' }
                    ]
                }
            ],
            submitLabel: 'Post goods receipt'
        };
    },

    execute({ state, scenario, payload }) {
        const receivedQuantity = Number(payload.receivedQuantity);
        const orderedQuantity = state.procurement.purchaseOrder.quantity;
        const fieldErrors = {};

        if (!Number.isFinite(receivedQuantity) || receivedQuantity < 1 || receivedQuantity > orderedQuantity) {
            fieldErrors.receivedQuantity = `Enter a quantity between 1 and ${orderedQuantity}.`;
        }

        if (payload.condition === 'hold') {
            fieldErrors.condition = 'This first scenario continues with an accepted delivery.';
        }

        if (Object.keys(fieldErrors).length > 0) {
            return {
                ok: false,
                message: 'The receipt cannot be posted yet.',
                fieldErrors
            };
        }

        const materialDocument = {
            id: scenario.documentNumbers.materialDocument,
            type: 'Material document',
            module: 'Inventory',
            amount: null,
            status: `${receivedQuantity} units received`
        };

        return {
            ok: true,
            message: `${materialDocument.id} posted. Stock increased from ${state.inventory.openingStock} to ${state.inventory.openingStock + receivedQuantity}.`,
            state: {
                ...state,
                inventory: {
                    ...state.inventory,
                    receivedQuantity
                },
                documents: [...state.documents, materialDocument]
            }
        };
    }
};

export const inventoryModule = {
    id: 'inventory',
    label: 'Inventory management',
    tasks: [postGoodsReceiptTask]
};
