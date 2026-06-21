export const procureToPayScenario = {
    id: 'p2p-laptop-purchase',
    title: 'Procure to pay',
    subtitle: 'Purchase 20 laptops for a growing operations team',
    company: {
        name: 'Northstar Mobility Services',
        companyCode: 'NS01',
        plant: 'Mangaluru Operations · MLR-01',
        currency: 'INR',
        locale: 'en-IN'
    },
    request: {
        materialCode: 'LT-2400',
        materialName: 'Business laptop, 14-inch',
        quantity: 20,
        deliveryDate: '2026-07-15',
        costCenter: 'OPS-410 · Customer operations',
        storageLocation: 'Main equipment store · EQ-01',
        budget: 1200000
    },
    vendors: [
        {
            id: 'coastal-systems',
            name: 'Coastal Systems Pvt Ltd',
            unitPrice: 58000,
            leadTime: '7 days'
        },
        {
            id: 'western-office-tech',
            name: 'Western Office Tech',
            unitPrice: 60500,
            leadTime: '4 days'
        }
    ],
    invoice: {
        reference: 'INV-CS-8821',
        dueDate: '2026-08-14'
    },
    bankAccounts: [
        {
            id: 'operating-inr',
            name: 'Operating account · INR 2001'
        }
    ],
    documentNumbers: {
        requisition: 'PR-1000450',
        purchaseOrder: 'PO-4500018',
        materialDocument: 'MD-5000082',
        invoice: 'IV-5100036',
        payment: 'PY-2000021'
    },
    provenance: {
        label: 'Fictional educational data',
        note: 'No real organizations, prices, or documents.'
    }
};

export function createInitialState(scenario) {
    return {
        scenarioId: scenario.id,
        currentTaskIndex: 0,
        completed: false,
        feedback: null,
        documents: [],
        procurement: {
            requisition: null,
            purchaseOrder: null
        },
        inventory: {
            openingStock: 8,
            receivedQuantity: 0
        },
        finance: {
            invoice: null,
            payment: null,
            openPayable: 0
        }
    };
}
