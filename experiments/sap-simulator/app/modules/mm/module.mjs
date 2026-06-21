function formatCurrency(value, scenario) {
    return new Intl.NumberFormat(scenario.company.locale, {
        style: 'currency',
        currency: scenario.company.currency,
        maximumFractionDigits: 0
    }).format(value);
}

const createRequisitionTask = {
    id: 'mm.create-requisition',
    stepLabel: 'Request',
    moduleLabel: 'Purchasing',

    getView({ scenario }) {
        return {
            role: 'Requester',
            title: 'Create a purchase requisition',
            description: 'Record the internal need before a supplier is contacted.',
            why: 'A requisition reserves intent and gives purchasing a traceable request to review.',
            summary: [
                { label: 'Material', value: `${scenario.request.materialCode} · ${scenario.request.materialName}` },
                { label: 'Plant', value: scenario.company.plant },
                { label: 'Available budget', value: formatCurrency(scenario.request.budget, scenario) }
            ],
            fields: [
                {
                    name: 'quantity',
                    label: 'Quantity requested',
                    type: 'number',
                    min: 1,
                    max: 50,
                    value: scenario.request.quantity,
                    help: 'The operations lead confirmed a requirement for 20 units.'
                },
                {
                    name: 'deliveryDate',
                    label: 'Required delivery date',
                    type: 'date',
                    value: scenario.request.deliveryDate
                },
                {
                    name: 'costCenter',
                    label: 'Cost center',
                    type: 'select',
                    value: scenario.request.costCenter,
                    options: [
                        { value: scenario.request.costCenter, label: scenario.request.costCenter }
                    ]
                }
            ],
            submitLabel: 'Create requisition'
        };
    },

    execute({ state, scenario, payload }) {
        const quantity = Number(payload.quantity);
        const fieldErrors = {};

        if (quantity !== scenario.request.quantity) {
            fieldErrors.quantity = `Use the confirmed requirement of ${scenario.request.quantity} units for this lesson.`;
        }

        if (!payload.deliveryDate) {
            fieldErrors.deliveryDate = 'Choose the required delivery date.';
        }

        if (Object.keys(fieldErrors).length > 0) {
            return {
                ok: false,
                message: 'Check the request details before posting.',
                fieldErrors
            };
        }

        const estimatedValue = scenario.vendors[0].unitPrice * quantity;
        const requisition = {
            id: scenario.documentNumbers.requisition,
            type: 'Purchase requisition',
            module: 'Purchasing',
            amount: estimatedValue,
            status: 'Approved for sourcing'
        };

        return {
            ok: true,
            message: `${requisition.id} created. Purchasing can now select a supplier.`,
            state: {
                ...state,
                procurement: {
                    ...state.procurement,
                    requisition
                },
                documents: [...state.documents, requisition]
            }
        };
    }
};

const createPurchaseOrderTask = {
    id: 'mm.create-purchase-order',
    stepLabel: 'Order',
    moduleLabel: 'Purchasing',

    getView({ scenario, state }) {
        return {
            role: 'Buyer',
            title: 'Convert the request into a purchase order',
            description: `Source the approved requisition ${state.procurement.requisition.id} from a supplier.`,
            why: 'The purchase order is the commercial commitment. Price, quantity, and delivery terms become the reference for later checks.',
            summary: [
                { label: 'Requested quantity', value: `${scenario.request.quantity} laptops` },
                { label: 'Delivery target', value: scenario.request.deliveryDate },
                { label: 'Budget limit', value: formatCurrency(scenario.request.budget, scenario) }
            ],
            fields: [
                {
                    name: 'vendorId',
                    label: 'Select a supplier',
                    type: 'radio',
                    value: scenario.vendors[0].id,
                    options: scenario.vendors.map((vendor) => ({
                        value: vendor.id,
                        label: vendor.name,
                        description: `${formatCurrency(vendor.unitPrice, scenario)} per unit · ${vendor.leadTime}`
                    }))
                }
            ],
            submitLabel: 'Create purchase order'
        };
    },

    execute({ state, scenario, payload }) {
        const vendor = scenario.vendors.find((candidate) => candidate.id === payload.vendorId);

        if (!vendor) {
            return {
                ok: false,
                message: 'Select a supplier before creating the order.',
                fieldErrors: { vendorId: 'A supplier is required.' }
            };
        }

        const total = vendor.unitPrice * scenario.request.quantity;

        if (total > scenario.request.budget) {
            return {
                ok: false,
                message: `${vendor.name} totals ${formatCurrency(total, scenario)}, which exceeds the approved budget.`,
                fieldErrors: { vendorId: 'Choose a supplier within the approved budget.' }
            };
        }

        const purchaseOrder = {
            id: scenario.documentNumbers.purchaseOrder,
            type: 'Purchase order',
            module: 'Purchasing',
            amount: total,
            status: 'Sent to supplier',
            vendorId: vendor.id,
            vendorName: vendor.name,
            quantity: scenario.request.quantity
        };

        return {
            ok: true,
            message: `${purchaseOrder.id} sent to ${vendor.name}. The warehouse can receive against it.`,
            state: {
                ...state,
                procurement: {
                    ...state.procurement,
                    purchaseOrder
                },
                documents: [...state.documents, purchaseOrder]
            }
        };
    }
};

export const mmModule = {
    id: 'mm',
    label: 'Materials management',
    tasks: [createRequisitionTask, createPurchaseOrderTask]
};
