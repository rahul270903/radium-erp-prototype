# Radium ERP — Phase 3.1 Corrected Prototype

A responsive React + TypeScript + Vite frontend prototype. Phase 2 extends the Phase 1 application shell with writable Finance & Accounting workflows.

## Included in Phase 1

- Enterprise application shell, responsive navigation, dashboard and demo KPIs.
- Global search, notifications, demo role-context switcher and ARIA integration boundary.
- Navigation for Radium ERP functional groups.

## Included in Phase 2

Six writable finance transaction workspaces, available from the Finance & Planning navigation:

1. **Journal Entries** — multi-line journal editor, debit/credit validation, add/remove lines, draft and approval workflow, posted read-only state.
2. **Supplier Invoices** — invoice capture fields, source reference, duplicate source-reference check, approval and simulated posting.
3. **Customer Invoices** — invoice records, due dates, source references, approval and simulated posting.
4. **Payment Receipts** — incoming receipt capture, payment method, partial-receipt demo record, approval and simulated application state.
5. **Payment Processing** — supplier payment proposal records, method, due date, approval and simulated settlement.
6. **Expense Claims** — employee, category, business purpose, amount and policy/exception note, approval and simulated completion.

Shared capabilities:

- Search and status filtering by transaction type.
- Transaction detail panels with source references and activity history.
- Draft create and edit → Pending Approval → Approved → Posted / Paid lifecycle (with rejection path).
- Browser-local persistence through `localStorage`.
- Seeded illustrative finance transactions.
- Clear demo notices; no external systems are connected.

## Run locally

Requires Node.js 20 or newer (Node.js 22 recommended).

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

## Build and check

```bash
npm run typecheck
npm run build
npm run preview
```

## Accounting and safety boundaries

- Journal lines must balance (non-zero debit total equals credit total) before submission.
- A posted journal is read-only in the prototype. Corrections must be modelled as linked reversals or adjustments in a production implementation.
- Operational transactions are shown as flowing through a simulated Subledger Accounting event. There is no direct GL write from AP, AR, receipts, payments or expenses.
- Approval and posting are UI simulations. There is no live role-based authorisation, separation-of-duties enforcement, bank instruction, payment gateway, tax engine, invoice OCR, procurement match service or production accounting engine.
- Supplier invoice duplicate checking is a basic demo check against supplier and a supplied source/invoice reference; it is not the fuzzy alias/amount/date-proximity matching required by the full specification.
- Receipt application, partial/over/short payments, expense policy checks and supplier matching are illustrative; no real cash movement or reconciliation takes place.
- All records persist only in the current browser's local storage. Clearing browser data removes them.
- USD is used as the illustrative demo currency and is not declared as a production base currency.

## Source alignment

The finance workflow boundaries follow VEC-950-ERS, particularly ERP-FIN-001–014 (General Ledger and Subledger Accounting), ERP-FIN-016–024 (Accounts Payable), ERP-FIN-027–033 (Accounts Receivable), and ERP-FIN-068–071 (Expense Management). The architecture rule that business events reach the books through Subledger Accounting is retained. Features requiring external services or production-grade controls are explicitly marked as simulated or out of scope.

## Project status

- Phase 1: application shell and dashboard.
- Phase 2: writable Finance & Accounting prototype.
- Phase 3 / 3.1: Procurement, Inventory & Warehouse workflows and build hotfix.
- Phase 4: Sales & Distribution, Asset Management and Projects.
- Phase 5: Product Engineering, Production Planning, Quality, Transportation & Logistics, Service & Field Service, HCM, and EHS.
- Phase 6: Management Accounting and Enterprise Performance Management (EPM).


## Phase 3 — Procurement, Inventory & Warehouse

Phase 3 extends the Phase 2 project with interactive workspaces for:

- Purchase requisitions and approval queue
- Purchase orders and supplier commitments
- Supplier directory, qualification status and profile view
- Inventory position by item, warehouse and bin
- Illustrative material valuation
- Warehouse locations and receiving / transfer work queue
- Goods receipts with purchase-order reference and inspection hold
- Inventory transfers with dispatch and destination receipt states
- Inventory adjustments with approval and negative-on-hand prevention

### Local demo behaviour

Supply records, stock balances and supplier records persist in browser `localStorage` using `radium-phase3-records`, `radium-phase3-stock` and `radium-phase3-suppliers`. Receipt approval adds quantities to the configured location; inspection-held receipt quantities enter Quarantine. Transfer dispatch decreases the source stock and the destination receipt increases destination stock. Adjustments are applied only when an approved adjustment is applied. Negative on-hand is blocked. Lot-controlled and serial-controlled products require their respective identifiers in the transaction form.

### Routes added

- `/procurement/requisitions`
- `/procurement/purchase-orders`
- `/procurement/suppliers`
- `/inventory/management`
- `/inventory/valuation`
- `/inventory/transfers`
- `/inventory/adjustments`
- `/warehouse/operations`
- `/warehouse/goods-receipts`

These are simulated frontend workflows. PO remaining-quantity reconciliation, over-receipt tolerances, supplier screening, real-time ATP, cost-layer accounting, advanced warehouse wave planning, mobile offline sync and live ERP / GL integration remain outside this phase.

## Phase 3.1 build hotfix

This revision addresses the two build errors reported when testing the prior hotfix package:

1. **Module filename:** `App.tsx` imports `./features/supply/SupplyWorkspace`. The component must therefore be named exactly `src/features/supply/SupplyWorkspace.tsx` (not `SupplyWorkspace.fixed.tsx`).
2. **Lucide icon typing:** the Material Valuation navigation metadata now uses the imported `Boxes` Lucide icon directly. The prior wrapper function `Layers3Icon` did not satisfy the expected Lucide forward-ref component type.

The selected-record and requisition-conversion state declarations are retained. The corrected component has the exact path expected by `App.tsx`.

After extracting this complete project, run `npm install` followed by `npm run build`. A dependency-resolved build was not completed in the packaging environment, so the final compile still needs confirmation on the machine where dependencies are installed.

## Phase 4 — Sales, Assets and Projects

Phase 4 adds interactive browser-local workspaces for:

- Sales: Customer Master, Sales Orders, Pricing & Credit, Shipping & Billing.
- Assets: Asset Management and Maintenance Work Orders.
- Projects: Project Management with project dates, budget, billing model, baseline, resource and milestone fields.

Each workspace includes demo records, searchable/filterable registers, create/edit draft forms, required-field validation, approval transitions, activity history and localStorage persistence. Sales order amount can be estimated from quantity and unit price with tax and discount inputs. These are frontend simulations only: no live credit release, goods issue, shipment, invoice posting, depreciation, project costing or external integration is executed.

## Phase 5 — Manufacturing, Quality, Logistics, People & Compliance

Phase 5 adds seven interactive operational workspaces:

1. **Product Engineering** — product class and lifecycle, revision, BOM components, routing, effectivity, compliance / traceability notes and engineering change rationale.
2. **Production Planning** — production-order type, product revision, BOM reference, quantity, work centre, material readiness, capacity, planned cost and shop-floor confirmation fields.
3. **Quality Management** — incoming / in-process / final inspection, inspection plan, lot / serial source, sample and affected quantities, acceptance result, disposition, non-conformance, CAPA and effectiveness verification.
4. **Transportation & Logistics** — shipment and delivery references, carrier, transport mode, origin / destination, route, dispatch, ETA, tracking, freight cost and settlement reference.
5. **Service & Field Service** — service orders, customer / installed asset, request channel, priority, warranty / entitlement, SLA target, skills, technician assignment, appointment, parts, checklist and technician debrief.
6. **Human Capital Management** — worker identity and lifecycle, organisation / position, manager, location, time pattern, pay group, qualifications, certification expiry, attendance / timesheet fields, leave and onboarding references.
7. **Environment, Health & Safety** — incident / near-miss, risk assessment, inspection and environmental record fields, responsible owner, severity, immediate controls, root cause, corrective action and evidence.

### Phase 5 interaction and persistence

Each workspace has seeded sample records, searchable and status-filterable registers, create / edit forms, required-field validation, draft and review submission, record details, activity history, simulated approval or workflow progression, and browser `localStorage` persistence under `radium-phase5:<route>`.

Workflow progressions are demonstrative only. For example, production orders can move through release, in-progress and completed states; shipments can progress through scheduled, dispatched, in-transit and completed; service orders can progress through scheduling, dispatch and technician execution; EHS records can progress through investigation and closure.

### Phase 5 boundaries and limitations

- Product engineering BOM and routing are captured as editable structured-text fields; no engineering CAD, revision effectivity engine or automatic where-used impact calculation is connected.
- Production planning and shop-floor confirmations are simulated; there is no finite-capacity scheduler, MES connection, inventory backflush, WIP valuation or real production posting.
- Quality inspection, non-conformance and CAPA records are demonstrative; dispositions do not actually release, quarantine, rework or scrap inventory.
- Transportation and field service do not book live carriers, optimize routes, obtain GPS / geo-fence events, synchronize an offline mobile client or settle freight.
- HCM worker and attendance fields do not run payroll, tax withholding, benefits or identity provisioning. Worker data shown is synthetic demo data.
- EHS records do not replace a statutory reporting system, digital permit-to-work control or a certified safety management process.
- No live ERP, CRM, payroll, warehouse, manufacturing, carrier, field-service or regulatory integration is configured.

### Phase 5 routes added

- `/manufacturing/product-engineering`
- `/manufacturing/production-planning`
- `/quality/management`
- `/logistics/transportation`
- `/service/field-service`
- `/people/hcm`
- `/ehs/management`

The fields and module boundaries are based on the Radium feature guide and VEC-950-ERS. The current frontend is an interactive prototype, not a production ERP execution engine.



## Phase 6 — Management Accounting & Enterprise Performance Management

Phase 6 adds two connected Finance & Planning workspaces, based on the Radium module architecture and VEC-950-ERS requirements.

### Management Accounting

- **Cost Centre Accounting** — effective dates, hierarchy, responsible manager, permitted cost elements, plan / commitment / actual values and variance thresholds.
- **Profit Centre Accounting** — independent responsibility structures, revenue and cost dimensions, contribution margin and posting derivation rules.
- **Internal Orders** — temporary cost collectors, budget availability control, tolerance and settlement receiver / rule.
- **Product Costing** — standard, current, planned, actual and simulated variants with material, labour, machine, overhead and scrap cost components.
- **Activity-Based Costing** — driver quantities, activity rates, sender / receiver objects, multi-stage allocation and traceability notes.

### Enterprise Performance Management (EPM)

- **Integrated Planning & Budgeting** — revenue, operating cost, capex, workforce and operational drivers, with top-down target versus bottom-up submission fields.
- **Scenario Planning** — copy-on-write scenario records, shock assumptions, impact fields and a required rationale before simulated merge to consensus.
- **Financial Consolidation** — entity scope, ownership method, currency translation, intercompany elimination, minority interest and reporting basis.
- **Account Reconciliation** — preparer / reviewer / certifier, live-balance fields, unmatched amounts and evidence.
- **Period Close** — task ownership, dependencies, due dates, evidence, blocking flags and a simulated hard-close control that prevents locking while blocking tasks remain unresolved.
- **Narrative Reporting & Enterprise Data** — board / statutory / sustainability report records, dimension change requests, impact analysis and hierarchy version notes.
- **Calculation Fabric** — model version, calculation type, populated cells, runtime, write-conflict count, execution plan and reproducibility evidence. Calculation runs are simulated.

### Phase 6 interaction and persistence

Each functional workspace has seeded example records, searchable and status-filterable registers, create / edit forms, required-field checks, detail views, history, and browser `localStorage` persistence under `radium-phase6:<route>`. Workflow transitions are demonstrative. The prototype includes budget-tolerance validation for internal orders, calculated product cost and activity allocations, scenario merge rationale validation, and period-close blocking-task validation.

### Phase 6 boundaries and limitations

- Cost allocations, profitability results and product-cost estimates are illustrative; they do not create journal postings or update the general ledger.
- Planning models, driver propagation, scenario blending, consolidation, foreign-currency translation and reconciliation are simulated frontend records, not a production calculation or consolidation engine.
- Period-close locking is a local demo control. It does not close a live accounting period or generate a statutory evidence pack.
- Narrative and dimension records capture source references and change-impact notes; no live board-book publishing, taxonomy validation or master-data governance service is connected.
- Calculation Fabric runtime and cell counts are illustrative. No sparse multidimensional database, optimisation solver, concurrency engine or sub-second recalculation service is present.
- All changes persist only in the current browser's local storage. No production access control, approval authority matrix, or external accounting integration is configured.

### Phase 6 routes added

- `/finance/management-accounting`
- `/finance/epm`

The interface is an interactive planning and management-accounting prototype, not a production ledger, consolidation, financial close or EPM execution platform.


## Phase 7 — Retail & Edge, Platform Foundation, AI & Agents, and ARIA Integration

Phase 7 completes the requested final prototype navigation areas. The additions are interactive browser-local simulations and are not connected to production systems.

### Retail & Edge — 9 capabilities

- Assisted Retail POS
- Self-Checkout and attendant exceptions
- Mobile POS
- Kiosk transactions
- Scan & Go journeys and basket validation
- Offline transaction queue, idempotency references and conflict resolution
- Token-reference-only payment processing
- Fiscal receipt and compliance records
- Hospitality order and service operations

The nine capabilities are surfaced as tabs inside the Retail & Edge workspace at `/retail/pos`. Payment screens intentionally avoid PAN, CVV, bank credentials and secret fields. Token references and simulated payment states only are captured.

### Platform Foundation — 22 capabilities across 6 workspaces

- **Workflow & Approvals:** Workflow & Orchestration, Low-Code Builder, Mobile Workspaces, Offline-First Operations, Adaptive Workspaces.
- **Identity & Access:** Identity & Access Management, Encryption & Key Management, Consent & Privacy Controls, Data Loss Prevention, Multi-Tenancy & Isolation.
- **Integration Gateway:** API & Integration Gateway, EDI & Partner Network, Event-Driven Backbone.
- **Analytics & Metrics:** Shared Business Data Graph, Governed Metrics Layer, Natural-Language Analytics, Self-Service Analytics, Standard Report Packs.
- **Audit Trail:** Immutable Audit Trail, Platform Observability, Document Management.
- **AI Governance:** AI Governance.

These areas are available at `/platform/workflows`, `/platform/identity`, `/platform/integrations`, `/platform/analytics`, `/platform/audit`, and `/platform/ai-governance`. Identity, access, encryption, multi-tenancy, audit integrity and integrations are represented as metadata and simulated controls; this prototype does not enforce them as a production security platform.

### AI & Agents — 16 definitions and controls

The Agent Registry lists the 14 specialist agents named in the Radium feature guide, plus Governed Digital Employees and Autonomy & Approval Controls. It includes sample owner, risk, autonomy and human-approval details, with demo suspend/reactivate states. No model calls or autonomous production actions are initiated.

Available at `/ai/agents`.

### ARIA Integration — separate-application reference layer

The ARIA workspace is a mapping register for ARIA and Radium record identifiers. It preserves the application boundary: ARIA remains a separate CRM, and no ARIA user interface is embedded in Radium. Sample mappings and new mapping records are stored in this browser only. A live connector requires an approved API contract, authentication and secret management, field ownership, event schemas, retry policy, tenant isolation and audit controls.

Available at `/integrations/aria`.

### Final-phase boundaries

- All records and workflow transitions in Phase 7 are illustrative and stored in browser `localStorage`.
- Platform pages do not provision identities, authenticate users, rotate keys, enforce access policies, publish events, send EDI documents or provide a tamper-proof audit store.
- Analytics data, integration endpoints, event activity, agent status and compliance evidence are examples, not live operational telemetry.
- The ARIA mapping register does not sync customer or CRM data.
- The application has no production backend, database, server-side authorization, or production-grade secrets store. Do not enter confidential customer, employee, payment or credential data.

## Deployment — Vercel

This repository includes `vercel.json` for Vite static output and client-side route rewrites. To deploy: 

1. Commit and push the complete project to a GitHub repository you control.
2. Import that repository into Vercel.
3. Select the Vite preset, build command `npm run build`, and output directory `dist` (these values are also specified in `vercel.json`).
4. Deploy a preview first; test the dashboard, all navigation groups, and each of the Phase 7 routes.
5. Promote to production only after review. Check Vercel deployment protection / access settings before sharing a public URL.
6. Share the deployed URL with Marlon only after you have checked it in a private browser window.

A hosted URL is not included in this source archive. Hosting, GitHub and Vercel accounts must be connected and the deployment must complete before a real share link exists.
