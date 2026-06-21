function formatCurrency(value, scenario) {
    return new Intl.NumberFormat(scenario.company.locale, {
        style: 'currency',
        currency: scenario.company.currency,
        maximumFractionDigits: 0
    }).format(value);
}

const postInvoiceTask = {
    id: 'fi.post-invoice',
    stepLabel: 'Invoice',
    moduleLabel: 'Finance',

    getView({ scenario, state }) {
        const purchaseOrder = state.procurement.purchaseOrder;

        return {
            role: 'Accounts payable specialist',
            title: 'Verify and post the supplier invoice',
            description: 'Match the invoice to the purchase order and goods receipt before creating a payable.',
            why: 'The three-way match prevents payment for the wrong price, quantity, or an undelivered order.',
            summary: [
                { label: 'Purchase order', value: purchaseOrder.id },
                { label: 'Goods received', value: `${state.inventory.receivedQuantity} laptops` },
                { label: 'Expected total', value: formatCurrency(purchaseOrder.amount, scenario) }
            ],
            fields: [
                {
                    name: 'invoiceReference',
                    label: 'Supplier invoice reference',
                    type: 'text',
                    value: scenario.invoice.reference
                },
                {
                    name: 'invoiceTotal',
                    label: 'Invoice total',
                    type: 'number',
                    min: 1,
                    value: purchaseOrder.amount,
                    prefix: '₹',
                    help: 'The total must match the approved purchase order.'
                },
                {
                    name: 'dueDate',
                    label: 'Payment due date',
                    type: 'date',
                    value: scenario.invoice.dueDate
                }
            ],
            submitLabel: 'Post invoice'
        };
    },

    execute({ state, scenario, payload }) {
        const invoiceTotal = Number(payload.invoiceTotal);
        const expectedTotal = state.procurement.purchaseOrder.amount;
        const fieldErrors = {};

        if (!payload.invoiceReference?.trim()) {
            fieldErrors.invoiceReference = 'Enter the supplier invoice reference.';
        }

        if (invoiceTotal !== expectedTotal) {
            fieldErrors.invoiceTotal = `Enter the matched purchase-order total of ${formatCurrency(expectedTotal, scenario)}.`;
        }

        if (!payload.dueDate) {
            fieldErrors.dueDate = 'Enter the payment due date.';
        }

        if (Object.keys(fieldErrors).length > 0) {
            return {
                ok: false,
                message: 'The three-way match has not passed.',
                fieldErrors
            };
        }

        const invoice = {
            id: scenario.documentNumbers.invoice,
            type: 'Supplier invoice',
            module: 'Finance',
            amount: invoiceTotal,
            status: 'Open for payment',
            reference: payload.invoiceReference.trim()
        };

        return {
            ok: true,
            message: `${invoice.id} posted after a successful three-way match.`,
            state: {
                ...state,
                finance: {
                    ...state.finance,
                    invoice,
                    openPayable: invoiceTotal
                },
                documents: [...state.documents, invoice]
            }
        };
    }
};

const releasePaymentTask = {
    id: 'fi.release-payment',
    stepLabel: 'Pay',
    moduleLabel: 'Finance',

    getView({ scenario, state }) {
        return {
            role: 'Payment approver',
            title: 'Release the supplier payment',
            description: `The verified invoice ${state.finance.invoice.id} is ready for payment.`,
            why: 'Payment clears the supplier liability and completes the procure-to-pay document chain.',
            summary: [
                { label: 'Supplier', value: state.procurement.purchaseOrder.vendorName },
                { label: 'Amount due', value: formatCurrency(state.finance.openPayable, scenario) },
                { label: 'Due date', value: scenario.invoice.dueDate }
            ],
            fields: [
                {
                    name: 'bankAccountId',
                    label: 'Pay from',
                    type: 'select',
                    value: scenario.bankAccounts[0].id,
                    options: scenario.bankAccounts.map((account) => ({
                        value: account.id,
                        label: account.name
                    }))
                },
                {
                    name: 'approval',
                    label: 'Final check',
                    type: 'checkbox',
                    value: 'approved',
                    checkboxLabel: 'I verified the supplier, amount, and due date.'
                }
            ],
            submitLabel: 'Release payment'
        };
    },

    execute({ state, scenario, payload }) {
        const fieldErrors = {};

        if (!scenario.bankAccounts.some((account) => account.id === payload.bankAccountId)) {
            fieldErrors.bankAccountId = 'Select a valid bank account.';
        }

        if (payload.approval !== 'approved') {
            fieldErrors.approval = 'Complete the final check before releasing payment.';
        }

        if (Object.keys(fieldErrors).length > 0) {
            return {
                ok: false,
                message: 'Payment needs a final approval check.',
                fieldErrors
            };
        }

        const payment = {
            id: scenario.documentNumbers.payment,
            type: 'Payment document',
            module: 'Finance',
            amount: state.finance.openPayable,
            status: 'Supplier paid'
        };

        return {
            ok: true,
            message: `${payment.id} posted. The supplier balance is now clear.`,
            state: {
                ...state,
                finance: {
                    ...state.finance,
                    payment,
                    openPayable: 0
                },
                documents: [...state.documents, payment]
            }
        };
    }
};

export const fiModule = {
    id: 'fi',
    label: 'Financial accounting',
    tasks: [postInvoiceTask, releasePaymentTask]
};
