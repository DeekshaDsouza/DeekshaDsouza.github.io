function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function formatCurrency(value, scenario) {
    return new Intl.NumberFormat(scenario.company.locale, {
        style: 'currency',
        currency: scenario.company.currency,
        maximumFractionDigits: 0
    }).format(value);
}

function renderFeedback(feedback) {
    if (!feedback) {
        return '<div class="feedback-space" aria-hidden="true"></div>';
    }

    const icon = feedback.tone === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check';
    const role = feedback.tone === 'error' ? 'alert' : 'status';

    return `
        <div class="feedback-banner feedback-${feedback.tone}" role="${role}" tabindex="-1">
            <i class="fa-solid ${icon}" aria-hidden="true"></i>
            <span>${escapeHtml(feedback.message)}</span>
        </div>
    `;
}

function renderSummary(summary) {
    return `
        <dl class="transaction-summary">
            ${summary.map((item) => `
                <div>
                    <dt>${escapeHtml(item.label)}</dt>
                    <dd>${escapeHtml(item.value)}</dd>
                </div>
            `).join('')}
        </dl>
    `;
}

function renderField(field, fieldErrors) {
    const error = fieldErrors[field.name];
    const errorId = `${field.name}-error`;
    const helpId = `${field.name}-help`;
    const describedBy = [field.help ? helpId : '', error ? errorId : ''].filter(Boolean).join(' ');
    const invalidAttribute = error ? 'aria-invalid="true"' : '';
    const describedByAttribute = describedBy ? `aria-describedby="${describedBy}"` : '';

    if (field.type === 'radio') {
        return `
            <fieldset class="form-field option-field" ${invalidAttribute} ${describedByAttribute}>
                <legend>${escapeHtml(field.label)}</legend>
                <div class="option-list">
                    ${field.options.map((option, index) => `
                        <label class="choice-row">
                            <input
                                type="radio"
                                name="${escapeHtml(field.name)}"
                                value="${escapeHtml(option.value)}"
                                ${option.value === field.value || (index === 0 && !field.value) ? 'checked' : ''}
                            >
                            <span>
                                <strong>${escapeHtml(option.label)}</strong>
                                ${option.description ? `<small>${escapeHtml(option.description)}</small>` : ''}
                            </span>
                        </label>
                    `).join('')}
                </div>
                ${error ? `<p class="field-error" id="${errorId}">${escapeHtml(error)}</p>` : ''}
            </fieldset>
        `;
    }

    if (field.type === 'checkbox') {
        return `
            <div class="form-field checkbox-field">
                <label class="check-row">
                    <input
                        type="checkbox"
                        name="${escapeHtml(field.name)}"
                        value="${escapeHtml(field.value)}"
                        ${invalidAttribute}
                        ${describedByAttribute}
                    >
                    <span>${escapeHtml(field.checkboxLabel)}</span>
                </label>
                ${error ? `<p class="field-error" id="${errorId}">${escapeHtml(error)}</p>` : ''}
            </div>
        `;
    }

    if (field.type === 'select') {
        return `
            <div class="form-field">
                <label for="${escapeHtml(field.name)}">${escapeHtml(field.label)}</label>
                <select
                    id="${escapeHtml(field.name)}"
                    name="${escapeHtml(field.name)}"
                    ${invalidAttribute}
                    ${describedByAttribute}
                >
                    ${field.options.map((option) => `
                        <option value="${escapeHtml(option.value)}" ${option.value === field.value ? 'selected' : ''}>
                            ${escapeHtml(option.label)}
                        </option>
                    `).join('')}
                </select>
                ${field.help ? `<p class="field-help" id="${helpId}">${escapeHtml(field.help)}</p>` : ''}
                ${error ? `<p class="field-error" id="${errorId}">${escapeHtml(error)}</p>` : ''}
            </div>
        `;
    }

    const inputAttributes = [
        field.min !== undefined ? `min="${escapeHtml(field.min)}"` : '',
        field.max !== undefined ? `max="${escapeHtml(field.max)}"` : ''
    ].filter(Boolean).join(' ');

    return `
        <div class="form-field">
            <label for="${escapeHtml(field.name)}">${escapeHtml(field.label)}</label>
            <div class="${field.prefix ? 'prefixed-input' : ''}">
                ${field.prefix ? `<span aria-hidden="true">${escapeHtml(field.prefix)}</span>` : ''}
                <input
                    id="${escapeHtml(field.name)}"
                    name="${escapeHtml(field.name)}"
                    type="${escapeHtml(field.type)}"
                    value="${escapeHtml(field.value)}"
                    ${inputAttributes}
                    ${invalidAttribute}
                    ${describedByAttribute}
                >
            </div>
            ${field.help ? `<p class="field-help" id="${helpId}">${escapeHtml(field.help)}</p>` : ''}
            ${error ? `<p class="field-error" id="${errorId}">${escapeHtml(error)}</p>` : ''}
        </div>
    `;
}

function renderDocumentFlow(documents, scenario) {
    if (documents.length === 0) {
        return '<p class="empty-flow">Documents will appear here as you complete each step.</p>';
    }

    return `
        <ol class="document-list">
            ${documents.map((document) => `
                <li>
                    <span class="document-icon" aria-hidden="true"><i class="fa-solid fa-file-lines"></i></span>
                    <div>
                        <strong>${escapeHtml(document.id)}</strong>
                        <span>${escapeHtml(document.type)} · ${escapeHtml(document.status)}</span>
                    </div>
                    ${document.amount !== null ? `<b>${escapeHtml(formatCurrency(document.amount, scenario))}</b>` : ''}
                </li>
            `).join('')}
        </ol>
    `;
}

function renderProcessSteps(taskProgress) {
    return `
        <nav class="process-navigation" aria-label="Scenario progress">
            <ol class="process-steps">
                ${taskProgress.map((step, index) => `
                    <li class="process-step is-${step.status}" ${step.status === 'current' ? 'aria-current="step"' : ''}>
                        <span class="step-marker" aria-hidden="true">
                            ${step.status === 'complete' ? '<i class="fa-solid fa-check"></i>' : index + 1}
                        </span>
                        <span class="step-copy">
                            <strong>${escapeHtml(step.label)}</strong>
                            <small>${escapeHtml(step.moduleLabel)}</small>
                        </span>
                    </li>
                `).join('')}
            </ol>
        </nav>
    `;
}

function renderTask(snapshot) {
    const { currentTask, state } = snapshot;
    const fieldErrors = state.feedback?.fieldErrors ?? {};

    return `
        <aside class="lesson-context" aria-labelledby="role-title">
            <div>
                <p class="context-label">Your role</p>
                <h2 id="role-title">${escapeHtml(currentTask.role)}</h2>
                <p>${escapeHtml(currentTask.why)}</p>
            </div>
            <span class="module-tag">${escapeHtml(currentTask.moduleName)}</span>
        </aside>

        <section class="task-surface" aria-labelledby="task-title">
            ${renderFeedback(state.feedback)}
            <header class="task-heading">
                <p>${escapeHtml(currentTask.moduleLabel)}</p>
                <h2 id="task-title" tabindex="-1">${escapeHtml(currentTask.title)}</h2>
                <span>${escapeHtml(currentTask.description)}</span>
            </header>

            ${renderSummary(currentTask.summary)}

            <form id="task-form" novalidate>
                <div class="form-fields">
                    ${currentTask.fields.map((field) => renderField(field, fieldErrors)).join('')}
                </div>
                <div class="form-actions">
                    <button class="primary-button" type="submit">
                        ${escapeHtml(currentTask.submitLabel)}
                        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                    </button>
                </div>
            </form>
        </section>
    `;
}

function renderCompletion(snapshot) {
    const { scenario, state } = snapshot;
    const finalStock = state.inventory.openingStock + state.inventory.receivedQuantity;

    return `
        <section class="completion-surface" aria-labelledby="completion-title">
            ${renderFeedback(state.feedback)}
            <div class="completion-mark" aria-hidden="true"><i class="fa-solid fa-check"></i></div>
            <h2 id="completion-title" tabindex="-1">Process complete</h2>
            <p>You connected purchasing, inventory, and finance through one traceable document chain.</p>

            <dl class="completion-summary">
                <div><dt>Documents posted</dt><dd>${state.documents.length}</dd></div>
                <div><dt>Stock on hand</dt><dd>${finalStock} laptops</dd></div>
                <div><dt>Supplier balance</dt><dd>${formatCurrency(state.finance.openPayable, scenario)}</dd></div>
            </dl>

            <button class="primary-button" type="button" data-action="reset">
                Run the scenario again
                <i class="fa-solid fa-rotate-left" aria-hidden="true"></i>
            </button>
        </section>
    `;
}

export function renderApp(root, snapshot, actions) {
    const { scenario, state, taskProgress } = snapshot;
    const currentStep = Math.min(state.currentTaskIndex + 1, taskProgress.length);
    const progressPercent = state.completed ? 100 : (state.currentTaskIndex / taskProgress.length) * 100;

    root.innerHTML = `
        <header class="app-header">
            <a class="portfolio-link" href="../../index.html">
                <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
                <span>Back to portfolio</span>
            </a>
            <div class="product-name">
                <span class="product-mark" aria-hidden="true">PL</span>
                <span><strong>Process Lab</strong><small>Unofficial learning simulator</small></span>
            </div>
            <button class="quiet-button" type="button" data-action="reset">
                <i class="fa-solid fa-rotate-left" aria-hidden="true"></i>
                Reset
            </button>
        </header>

        <main class="simulator-main">
            <section class="scenario-intro" aria-labelledby="scenario-title">
                <div>
                    <p>${escapeHtml(scenario.company.name)} · ${escapeHtml(scenario.company.companyCode)}</p>
                    <h1 id="scenario-title">${escapeHtml(scenario.title)}</h1>
                    <span>${escapeHtml(scenario.subtitle)}</span>
                </div>
                <div class="progress-copy" aria-label="${state.completed ? 'Scenario complete' : `Step ${currentStep} of ${taskProgress.length}`}" >
                    <strong>${state.completed ? 'Complete' : `Step ${currentStep} of ${taskProgress.length}`}</strong>
                    <span>${state.completed ? 'Document chain closed' : escapeHtml(snapshot.currentTask.moduleName)}</span>
                </div>
            </section>

            <div class="mobile-progress" aria-hidden="true">
                <span style="width: ${progressPercent}%"></span>
            </div>

            ${renderProcessSteps(taskProgress)}

            <div class="learning-workspace ${state.completed ? 'is-complete' : ''}">
                ${state.completed ? renderCompletion(snapshot) : renderTask(snapshot)}
            </div>

            <details class="document-flow" ${state.completed ? 'open' : ''}>
                <summary>
                    <span>
                        <i class="fa-solid fa-diagram-project" aria-hidden="true"></i>
                        Document flow
                    </span>
                    <small>${state.documents.length} of ${taskProgress.length} posted</small>
                </summary>
                ${renderDocumentFlow(state.documents, scenario)}
            </details>
        </main>

        <footer class="app-footer">
            <span>${escapeHtml(scenario.provenance.label)} — ${escapeHtml(scenario.provenance.note)}</span>
            <span>SAP is a trademark of SAP SE. This experiment is independent and unaffiliated.</span>
        </footer>
    `;

    root.querySelector('#task-form')?.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        actions.submit(Object.fromEntries(formData.entries()));
    });

    root.querySelectorAll('[data-action="reset"]').forEach((button) => {
        button.addEventListener('click', actions.reset);
    });
}
