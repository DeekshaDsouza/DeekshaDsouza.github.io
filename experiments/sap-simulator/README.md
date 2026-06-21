# Process Lab

An unofficial browser-based learning simulator for understanding how an SAP-style procure-to-pay workflow connects purchasing, inventory, and finance.

## Architecture

- `app/core/` owns scenario progression and shared state.
- `app/modules/` contains independent business modules. Modules receive a state snapshot and return a validated next state; they do not import each other or touch the DOM.
- `app/data/` contains declarative scenarios and source provenance.
- `app/ui/` projects the current state into accessible HTML.
- `tests/` exercises the domain workflow without starting a browser.

## Adding a module

A module exports an object containing an `id`, a label, and an ordered list of tasks. Each task provides:

- `getView({ scenario, state })` for the task's display model.
- `execute({ scenario, state, payload })` for validation and state changes.

Register new modules in `app/modules/registry.mjs`. The shared engine discovers their tasks automatically.

## Data policy

The first scenario uses entirely synthetic educational data. Any future imported dataset should include its source URL, retrieval date, licence, transformation notes, and a small normalized snapshot rather than a live production dependency.

## Run locally

Serve the repository root with any static web server, then open `/experiments/sap-simulator/`.

Run the domain test with:

```sh
node experiments/sap-simulator/tests/simulation.test.mjs
```
