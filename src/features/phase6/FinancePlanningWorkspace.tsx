import { useEffect, useMemo, useState } from 'react';
import {
  Activity, ArrowRight, BadgeCheck, BarChart3, Calculator, Check, CircleDollarSign,
  ClipboardCheck, Database, FileBarChart, GitBranch, Layers, Plus, Search, Send,
  ShieldCheck, Sparkles, Target, X, type LucideIcon,
} from 'lucide-react';
import { SectionHeading } from '../../components/SectionHeading';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency, formatDate } from '../../lib/format';

type HistoryEntry = { action: string; by: string; at: string };
type BusinessRecord = {
  id: string; reference: string; title: string; date: string; status: string;
  amount: number; description: string; fields: Record<string, string>; history: HistoryEntry[];
};
type Field = { key: string; label: string; required?: boolean; type?: 'text' | 'date' | 'number' | 'textarea' | 'email'; options?: string[]; wide?: boolean };
type Column = { label: string; key: string };
type ViewConfig = {
  key: string; label: string; title: string; noun: string; icon: LucideIcon; amountLabel: string;
  columns: Column[]; fields: Field[]; seeds: BusinessRecord[]; transitions: Record<string, string>;
};
type WorkspaceConfig = { title: string; subtitle: string; views: ViewConfig[]; connectorNote: string };

const today = new Date().toISOString().slice(0, 10);
const history = (action: string): HistoryEntry[] => [{ action, by: 'Demo user', at: new Date().toLocaleString() }];
const row = (reference: string, title: string, status: string, amount: number, description: string, fields: Record<string, string>): BusinessRecord => ({
  id: reference, reference, title, date: today, status, amount, description, fields, history: history('Created as illustrative sample data'),
});

const managementViews: ViewConfig[] = [
  {
    key: 'cost-centres', label: 'Cost Centres', title: 'Cost Centre Accounting', noun: 'Cost Centre', icon: Calculator, amountLabel: 'Period actuals',
    columns: [{ label: 'Cost centre', key: 'reference' }, { label: 'Description', key: 'title' }, { label: 'Manager', key: 'manager' }, { label: 'Plan', key: 'plan' }, { label: 'Actual', key: 'amount' }, { label: 'Status', key: 'status' }],
    fields: [
      { key: 'code', label: 'Cost centre code', required: true }, { key: 'name', label: 'Cost centre name', required: true },
      { key: 'parent', label: 'Parent cost centre' }, { key: 'manager', label: 'Responsible manager', required: true },
      { key: 'validFrom', label: 'Valid from', type: 'date' }, { key: 'validTo', label: 'Valid to', type: 'date' },
      { key: 'costElements', label: 'Permitted cost element range', wide: true }, { key: 'plan', label: 'Period plan (USD)', type: 'number' },
      { key: 'actual', label: 'Period actual (USD)', type: 'number' }, { key: 'commitment', label: 'Open commitments (USD)', type: 'number' },
      { key: 'threshold', label: 'Variance alert threshold (%)', type: 'number' }, { key: 'notes', label: 'Control notes', type: 'textarea', wide: true },
    ],
    seeds: [
      row('CC-100', 'Network Operations', 'Active', 184500, 'Operations cost centre · variance within tolerance', { code: 'CC-100', parent: 'CC-000', manager: 'Operations Director', validFrom: '2026-01-01', validTo: '', costElements: 'Labour, utilities, network maintenance, field service', plan: '210000', actual: '184500', commitment: '12500', threshold: '10', notes: 'Monthly review; operational allocation basis.' }),
      row('CC-120', 'Technology & Engineering', 'Active', 93600, 'Engineering and product development costs', { code: 'CC-120', parent: 'CC-000', manager: 'Engineering Manager', validFrom: '2026-01-01', validTo: '', costElements: 'Engineering labour, software, testing, tooling', plan: '90000', actual: '93600', commitment: '6800', threshold: '8', notes: 'Variance review required.' }),
    ], transitions: { Draft: 'Pending Approval', 'Pending Approval': 'Approved', Approved: 'Active' },
  },
  {
    key: 'profit-centres', label: 'Profit Centres', title: 'Profit Centre Accounting', noun: 'Profit Centre', icon: Target, amountLabel: 'Contribution margin',
    columns: [{ label: 'Profit centre', key: 'reference' }, { label: 'Description', key: 'title' }, { label: 'Owner', key: 'owner' }, { label: 'Revenue', key: 'revenue' }, { label: 'Margin', key: 'amount' }, { label: 'Status', key: 'status' }],
    fields: [
      { key: 'code', label: 'Profit centre code', required: true }, { key: 'name', label: 'Profit centre name', required: true },
      { key: 'owner', label: 'Business owner', required: true }, { key: 'legalEntity', label: 'Legal entity' },
      { key: 'revenue', label: 'Revenue (USD)', type: 'number' }, { key: 'variableCost', label: 'Variable cost (USD)', type: 'number' },
      { key: 'directFixed', label: 'Direct fixed cost (USD)', type: 'number' }, { key: 'allocatedOverhead', label: 'Allocated overhead (USD)', type: 'number' },
      { key: 'derivationRule', label: 'Posting derivation rule', type: 'textarea', wide: true }, { key: 'notes', label: 'Internal transfer / reconciliation notes', type: 'textarea', wide: true },
    ],
    seeds: [
      row('PC-010', 'Connectivity Services', 'Active', 286000, 'Revenue less variable costs, direct fixed costs and allocated overhead', { code: 'PC-010', owner: 'Commercial Operations', legalEntity: 'Radium Services Ltd.', revenue: '720000', variableCost: '248000', directFixed: '92000', allocatedOverhead: '94000', derivationRule: 'Product line + service region + sales organisation', notes: 'Internal transfers reported separately from external sales.' }),
      row('PC-020', 'Infrastructure Projects', 'Active', 154000, 'Project delivery contribution margin', { code: 'PC-020', owner: 'Projects Director', legalEntity: 'Radium Services Ltd.', revenue: '510000', variableCost: '181000', directFixed: '78000', allocatedOverhead: '97000', derivationRule: 'Project business unit + delivery region', notes: 'Reconcile to legal entity view monthly.' }),
    ], transitions: { Draft: 'Pending Approval', 'Pending Approval': 'Approved', Approved: 'Active' },
  },
  {
    key: 'internal-orders', label: 'Internal Orders', title: 'Internal Order Control', noun: 'Internal Order', icon: ClipboardCheck, amountLabel: 'Actual spend',
    columns: [{ label: 'Order', key: 'reference' }, { label: 'Purpose', key: 'title' }, { label: 'Type', key: 'orderType' }, { label: 'Budget', key: 'budget' }, { label: 'Actual', key: 'amount' }, { label: 'Status', key: 'status' }],
    fields: [
      { key: 'name', label: 'Order description', required: true }, { key: 'orderType', label: 'Order type', options: ['Campaign', 'Maintenance job', 'Trial / pilot', 'Capital project', 'Event'] },
      { key: 'responsible', label: 'Responsible owner', required: true }, { key: 'budget', label: 'Approved budget (USD)', type: 'number' },
      { key: 'actual', label: 'Actual spend (USD)', type: 'number' }, { key: 'tolerance', label: 'Availability tolerance (%)', type: 'number' },
      { key: 'settlementReceiver', label: 'Settlement receiver', required: true }, { key: 'settlementRule', label: 'Settlement rule', options: ['100% to receiver', 'Percentage split', 'Periodic settlement'] },
      { key: 'settlementPercent', label: 'Settlement percentage', type: 'number' }, { key: 'validTo', label: 'Planned completion', type: 'date' },
      { key: 'notes', label: 'Purpose and settlement notes', type: 'textarea', wide: true },
    ],
    seeds: [
      row('IO-260041', 'Spalding fibre launch campaign', 'Approved', 22400, 'Campaign cost collector · within approved budget', { orderType: 'Campaign', responsible: 'Marketing Lead', budget: '35000', actual: '22400', tolerance: '5', settlementReceiver: 'PC-010 · Connectivity Services', settlementRule: '100% to receiver', settlementPercent: '100', validTo: '2026-12-15', notes: 'Settlement after campaign close.' }),
      row('IO-260052', 'Warehouse racking maintenance', 'Pending Approval', 8900, 'Maintenance internal order awaiting budget approval', { orderType: 'Maintenance job', responsible: 'Facilities Manager', budget: '12000', actual: '8900', tolerance: '5', settlementReceiver: 'CC-100 · Network Operations', settlementRule: 'Periodic settlement', settlementPercent: '100', validTo: '2026-11-30', notes: 'Cost to be settled after work-order completion.' }),
    ], transitions: { Draft: 'Pending Approval', 'Pending Approval': 'Approved', Approved: 'Released', Released: 'Settled' },
  },
  {
    key: 'product-costing', label: 'Product Costing', title: 'Product Costing & Profitability', noun: 'Cost Estimate', icon: CircleDollarSign, amountLabel: 'Calculated unit cost',
    columns: [{ label: 'Cost estimate', key: 'reference' }, { label: 'Product', key: 'title' }, { label: 'Variant', key: 'variant' }, { label: 'Material', key: 'material' }, { label: 'Total cost', key: 'amount' }, { label: 'Status', key: 'status' }],
    fields: [
      { key: 'product', label: 'Product / item', required: true }, { key: 'variant', label: 'Costing variant', options: ['Standard', 'Current', 'Planned', 'Actual', 'Simulated'] },
      { key: 'bomRevision', label: 'BOM revision' }, { key: 'material', label: 'Material cost (USD)', type: 'number' },
      { key: 'labour', label: 'Labour cost (USD)', type: 'number' }, { key: 'machine', label: 'Machine / activity cost (USD)', type: 'number' },
      { key: 'overhead', label: 'Applied overhead (USD)', type: 'number' }, { key: 'scrap', label: 'Scrap allowance (USD)', type: 'number' },
      { key: 'quantity', label: 'Costed quantity', type: 'number' }, { key: 'effectiveDate', label: 'Effective date', type: 'date' },
      { key: 'variance', label: 'Variance analysis / driver breakdown', type: 'textarea', wide: true },
    ],
    seeds: [
      row('CE-260118', 'Fibre Access Terminal 16-Port', 'Released', 486, 'Standard cost build · released baseline', { product: 'Fibre Access Terminal 16-Port', variant: 'Standard', bomRevision: 'B', material: '268', labour: '82', machine: '36', overhead: '74', scrap: '26', quantity: '1', effectiveDate: '2026-10-01', variance: 'Baseline estimate: material 55.1%, labour 16.9%, machine 7.4%, overhead 15.2%, scrap 5.4%.' }),
      row('CE-260126', 'Outdoor Fibre Distribution Cabinet', 'Draft', 1965, 'Simulated current cost for design review', { product: 'Outdoor Fibre Distribution Cabinet', variant: 'Simulated', bomRevision: 'C', material: '1120', labour: '320', machine: '155', overhead: '280', scrap: '90', quantity: '1', effectiveDate: today, variance: 'Compare design-to-cost result to released standard before approval.' }),
    ], transitions: { Draft: 'Pending Approval', 'Pending Approval': 'Approved', Approved: 'Released' },
  },
  {
    key: 'activity-allocations', label: 'Activity Allocations', title: 'Activity-Based Costing', noun: 'Allocation Cycle', icon: GitBranch, amountLabel: 'Allocated cost',
    columns: [{ label: 'Cycle', key: 'reference' }, { label: 'Activity / driver', key: 'title' }, { label: 'Sender', key: 'sender' }, { label: 'Receiver', key: 'receiver' }, { label: 'Quantity', key: 'quantity' }, { label: 'Allocated', key: 'amount' }],
    fields: [
      { key: 'activity', label: 'Activity name', required: true }, { key: 'driver', label: 'Cost driver', options: ['Technician hours', 'Warehouse picks', 'Machine hours', 'Service calls', 'Purchase orders', 'Floor area'] },
      { key: 'sender', label: 'Sender cost centre / resource', required: true }, { key: 'receiver', label: 'Receiver cost object', required: true },
      { key: 'quantity', label: 'Driver quantity', type: 'number' }, { key: 'rate', label: 'Rate per driver unit (USD)', type: 'number' },
      { key: 'stages', label: 'Allocation stages', type: 'textarea', wide: true }, { key: 'cycleDate', label: 'Cycle date', type: 'date' },
      { key: 'notes', label: 'Allocation basis and traceability', type: 'textarea', wide: true },
    ],
    seeds: [
      row('ABC-26031', 'Field technician support', 'Posted', 18750, 'Technician hours × activity rate allocated to project work', { activity: 'Field technician support', driver: 'Technician hours', sender: 'CC-100 · Network Operations', receiver: 'Project PRJ-204 · Spalding build', quantity: '250', rate: '75', stages: 'Resource pool → Field support activity → Project task cost object', cycleDate: '2026-11-01', notes: '250 approved hours; allocation trace retained per source time entry.' }),
      row('ABC-26032', 'Warehouse handling', 'Draft', 6120, 'Pick activity allocation to outbound fulfilment', { activity: 'Warehouse handling', driver: 'Warehouse picks', sender: 'CC-130 · Warehouse', receiver: 'PC-010 · Connectivity Services', quantity: '510', rate: '12', stages: 'Warehouse labour → Pick activity → Fulfilment cost object', cycleDate: today, notes: 'Pending cycle validation.' }),
    ], transitions: { Draft: 'Pending Validation', 'Pending Validation': 'Approved', Approved: 'Posted' },
  },
];

const epmViews: ViewConfig[] = [
  {
    key: 'plans', label: 'Plans & Budgets', title: 'Integrated Planning & Budgeting', noun: 'Planning Version', icon: BarChart3, amountLabel: 'Planned revenue',
    columns: [{ label: 'Version', key: 'reference' }, { label: 'Planning scope', key: 'title' }, { label: 'Owner', key: 'owner' }, { label: 'Revenue', key: 'amount' }, { label: 'Cost', key: 'cost' }, { label: 'Status', key: 'status' }],
    fields: [
      { key: 'name', label: 'Planning version name', required: true }, { key: 'cycle', label: 'Planning cycle', options: ['Annual budget', 'Quarterly forecast', 'Strategic plan', 'Rolling forecast'] },
      { key: 'owner', label: 'Planning owner', required: true }, { key: 'period', label: 'Planning period' },
      { key: 'revenue', label: 'Revenue plan (USD)', type: 'number' }, { key: 'cost', label: 'Operating cost plan (USD)', type: 'number' },
      { key: 'capex', label: 'Capital expenditure (USD)', type: 'number' }, { key: 'headcount', label: 'Planned headcount', type: 'number' },
      { key: 'drivers', label: 'Operational drivers and dependencies', type: 'textarea', wide: true }, { key: 'topDownTarget', label: 'Top-down target (USD)', type: 'number' },
      { key: 'bottomUpSubmission', label: 'Bottom-up submission (USD)', type: 'number' }, { key: 'notes', label: 'Assumptions and submission notes', type: 'textarea', wide: true },
    ],
    seeds: [
      row('PLN-FY27-BUD', 'FY2027 Operating Budget', 'In Review', 4850000, 'Integrated finance, workforce, sales, supply, capital and project plan', { cycle: 'Annual budget', owner: 'FP&A Director', period: 'FY2027', revenue: '4850000', cost: '3290000', capex: '640000', headcount: '184', drivers: 'Subscriber growth → service revenue; workforce positions → payroll; demand plan → inventory and procurement; project milestones → capital spend.', topDownTarget: '4900000', bottomUpSubmission: '4850000', notes: 'Bottom-up submission is USD 50,000 below top-down target.' }),
      row('PLN-Q4-RF', 'Q4 Rolling Forecast', 'Approved', 1320000, 'Quarterly rolling forecast with attributed manual overrides', { cycle: 'Rolling forecast', owner: 'Corporate FP&A', period: '2026-Q4', revenue: '1320000', cost: '910000', capex: '125000', headcount: '176', drivers: 'Volume, price, mix, FX and approved hiring plan.', topDownTarget: '1300000', bottomUpSubmission: '1320000', notes: 'Overrides require author, timestamp and reason.' }),
    ], transitions: { Draft: 'Submitted', Submitted: 'In Review', 'In Review': 'Approved', Approved: 'Published' },
  },
  {
    key: 'rolling-forecast', label: 'Rolling Forecast', title: 'Rolling Forecast & Overrides', noun: 'Forecast Version', icon: BarChart3, amountLabel: 'Forecast revenue',
    columns: [{ label: 'Forecast', key: 'reference' }, { label: 'Period', key: 'forecastPeriod' }, { label: 'Version', key: 'title' }, { label: 'Owner', key: 'owner' }, { label: 'Revenue', key: 'amount' }, { label: 'Status', key: 'status' }],
    fields: [
      { key: 'name', label: 'Forecast version name', required: true }, { key: 'baseVersion', label: 'Source plan / forecast version', required: true },
      { key: 'forecastPeriod', label: 'Forecast period', required: true }, { key: 'owner', label: 'Forecast owner', required: true },
      { key: 'baselineRevenue', label: 'Baseline revenue (USD)', type: 'number' }, { key: 'revenueOverride', label: 'Revenue override (USD)', type: 'number' },
      { key: 'baselineCost', label: 'Baseline operating cost (USD)', type: 'number' }, { key: 'costOverride', label: 'Operating cost override (USD)', type: 'number' },
      { key: 'overrideAuthor', label: 'Override author' }, { key: 'overrideReason', label: 'Reason for manual override', type: 'textarea', wide: true },
      { key: 'carryForwardDrivers', label: 'Driver logic carried forward', type: 'textarea', wide: true },
    ],
    seeds: [
      row('RF-2026-11', 'November 2026 Rolling Forecast', 'In Review', 1345000, 'Forward forecast carries volume, price and workforce drivers into the next period', { forecastPeriod: '2026-11', baseVersion: 'PLN-Q4-RF', owner: 'Corporate FP&A', baselineRevenue: '1310000', revenueOverride: '35000', baselineCost: '920000', costOverride: '12000', overrideAuthor: 'FP&A Analyst', overrideReason: 'Approved service-price update and revised customer activation estimate.', carryForwardDrivers: 'Subscriber volume × average realised price; approved vacancies × fully loaded labour cost; open project milestones × delivery spend.' }),
    ], transitions: { Draft: 'In Review', 'In Review': 'Approved', Approved: 'Published' },
  },
  {
    key: 'scenarios', label: 'Scenarios', title: 'Scenario Planning & Sandboxes', noun: 'Planning Scenario', icon: GitBranch, amountLabel: 'Revenue impact',
    columns: [{ label: 'Scenario', key: 'reference' }, { label: 'Scenario name', key: 'title' }, { label: 'Base version', key: 'baseVersion' }, { label: 'Revenue impact', key: 'amount' }, { label: 'Cost impact', key: 'costImpact' }, { label: 'Status', key: 'status' }],
    fields: [
      { key: 'name', label: 'Scenario name', required: true }, { key: 'baseVersion', label: 'Base planning version', required: true },
      { key: 'owner', label: 'Scenario owner', required: true }, { key: 'revenueImpact', label: 'Revenue change (USD)', type: 'number' },
      { key: 'costImpact', label: 'Cost change (USD)', type: 'number' }, { key: 'capexImpact', label: 'Capex change (USD)', type: 'number' },
      { key: 'shock', label: 'Shock / assumption', type: 'textarea', wide: true }, { key: 'mergeReason', label: 'Merge rationale (required before consensus merge)', type: 'textarea', wide: true },
    ],
    seeds: [
      row('SCN-026', 'Fuel and freight inflation +8%', 'Draft', -64000, 'Copy-on-write sandbox · no shared plan changes until merge', { baseVersion: 'PLN-FY27-BUD', owner: 'Supply Planning Lead', revenueImpact: '-64000', costImpact: '118000', capexImpact: '0', shock: 'Freight rates +8%; selected supplier lead times +5 days.', mergeReason: '' }),
      row('SCN-027', 'Accelerated fibre rollout', 'Evaluating', 142000, 'Growth scenario with increased project capacity and subscriber activation', { baseVersion: 'PLN-FY27-BUD', owner: 'Strategy Office', revenueImpact: '142000', costImpact: '96000', capexImpact: '185000', shock: 'Increase deployment milestones by 12%; model workforce and material capacity.', mergeReason: '' }),
    ], transitions: { Draft: 'Evaluating', Evaluating: 'Reviewed', Reviewed: 'Ready to Merge', 'Ready to Merge': 'Merged' },
  },
  {
    key: 'consolidation', label: 'Consolidation', title: 'Financial Consolidation', noun: 'Consolidation Run', icon: Layers, amountLabel: 'Group revenue',
    columns: [{ label: 'Run', key: 'reference' }, { label: 'Period', key: 'title' }, { label: 'Entities', key: 'entities' }, { label: 'Currency', key: 'currency' }, { label: 'Revenue', key: 'amount' }, { label: 'Status', key: 'status' }],
    fields: [
      { key: 'period', label: 'Reporting period', required: true }, { key: 'entities', label: 'Included legal entities', required: true, type: 'textarea', wide: true },
      { key: 'currency', label: 'Group reporting currency', options: ['USD', 'EUR', 'GBP', 'JMD', 'INR'] }, { key: 'ownershipMethod', label: 'Ownership / consolidation method', options: ['Full consolidation', 'Proportionate', 'Equity method', 'Cost method'] },
      { key: 'revenue', label: 'Consolidated revenue (USD)', type: 'number' }, { key: 'intercompany', label: 'Intercompany elimination balance (USD)', type: 'number' },
      { key: 'fxRate', label: 'Translation rate / basis', type: 'text' }, { key: 'minorityInterest', label: 'Minority interest (USD)', type: 'number' },
      { key: 'gaap', label: 'Reporting basis', options: ['IFRS', 'US GAAP', 'Local GAAP'] }, { key: 'notes', label: 'Residuals and translation evidence', type: 'textarea', wide: true },
    ],
    seeds: [
      row('CON-2026-10', 'October 2026 Group Close', 'In Review', 2180000, 'Multi-entity consolidation with currency translation and intercompany matching', { period: '2026-10', entities: 'Radium Services Ltd.\nRadium Infrastructure Ltd.\nRadium Caribbean Ltd.', currency: 'USD', ownershipMethod: 'Full consolidation', revenue: '2180000', intercompany: '12500', fxRate: 'Closing rate 1.00 USD; JMD translated at approved close rate', minorityInterest: '18000', gaap: 'IFRS', notes: 'One intercompany residual remains assigned to the reconciliation owner.' }),
    ], transitions: { Draft: 'Processing', Processing: 'In Review', 'In Review': 'Certified', Certified: 'Locked' },
  },
  {
    key: 'reconciliations', label: 'Reconciliations', title: 'Account Reconciliation', noun: 'Account Reconciliation', icon: ClipboardCheck, amountLabel: 'Unreconciled balance',
    columns: [{ label: 'Reconciliation', key: 'reference' }, { label: 'Account / period', key: 'title' }, { label: 'Preparer', key: 'preparer' }, { label: 'Reviewer', key: 'reviewer' }, { label: 'Balance', key: 'amount' }, { label: 'Status', key: 'status' }],
    fields: [
      { key: 'account', label: 'Account number and description', required: true }, { key: 'period', label: 'Period', required: true },
      { key: 'preparer', label: 'Preparer', required: true }, { key: 'reviewer', label: 'Reviewer', required: true },
      { key: 'certifier', label: 'Certifier' }, { key: 'ledgerBalance', label: 'Live ledger balance (USD)', type: 'number' },
      { key: 'supportBalance', label: 'Supporting balance (USD)', type: 'number' }, { key: 'unmatched', label: 'Unmatched items (USD)', type: 'number' },
      { key: 'risk', label: 'Risk rating', options: ['Low', 'Medium', 'High', 'Critical'] }, { key: 'evidence', label: 'Matching and supporting evidence', type: 'textarea', wide: true },
    ],
    seeds: [
      row('REC-GL-1100', 'Cash clearing · 2026-10', 'Pending Review', 4200, 'Reconciliation prepared against current ledger balance', { account: '1100 · Cash clearing', period: '2026-10', preparer: 'Finance Analyst', reviewer: 'Financial Controller', certifier: 'Finance Director', ledgerBalance: '184200', supportBalance: '180000', unmatched: '4200', risk: 'Medium', evidence: 'Two unmatched bank items pending remittance details.' }),
      row('REC-AP-2100', 'Trade payables · 2026-10', 'Certified', 0, 'Subledger and GL balance matched', { account: '2100 · Trade payables', period: '2026-10', preparer: 'AP Lead', reviewer: 'Financial Controller', certifier: 'Finance Director', ledgerBalance: '392000', supportBalance: '392000', unmatched: '0', risk: 'Low', evidence: 'Automated many-to-many match accepted; reviewer sign-off recorded.' }),
    ], transitions: { Draft: 'Prepared', Prepared: 'Pending Review', 'Pending Review': 'Certified' },
  },
  {
    key: 'profitability-analysis', label: 'Profitability Analysis', title: 'Enterprise Profitability Analysis', noun: 'Profitability Segment', icon: Target, amountLabel: 'Contribution margin',
    columns: [{ label: 'Segment', key: 'reference' }, { label: 'Profitability segment', key: 'title' }, { label: 'Dimensions', key: 'dimensions' }, { label: 'Revenue', key: 'revenue' }, { label: 'Contribution margin', key: 'amount' }, { label: 'Status', key: 'status' }],
    fields: [
      { key: 'segmentName', label: 'Profitability segment name', required: true }, { key: 'dimensions', label: 'Segment characteristics', required: true, type: 'textarea', wide: true },
      { key: 'revenue', label: 'Gross revenue (USD)', type: 'number' }, { key: 'variableCost', label: 'Variable cost (USD)', type: 'number' },
      { key: 'directFixed', label: 'Direct fixed cost (USD)', type: 'number' }, { key: 'overhead', label: 'Allocated overhead (USD)', type: 'number' },
      { key: 'basis', label: 'Margin analysis basis', options: ['Account-based', 'Costing-based', 'Combined / reconciled'] },
      { key: 'ledgerReconciliation', label: 'Ledger reconciliation reference', required: true }, { key: 'notes', label: 'Volume, price, mix and one-off analysis', type: 'textarea', wide: true },
    ],
    seeds: [
      row('PA-SEG-010', 'Connectivity · Caribbean South', 'In Review', 286000, 'Contribution margin by service, market and channel characteristics', { segmentName: 'Connectivity · Caribbean South', dimensions: 'Service line: Connectivity; Region: Caribbean South; Channel: Direct; Customer class: Enterprise', revenue: '720000', variableCost: '248000', directFixed: '92000', overhead: '94000', basis: 'Combined / reconciled', ledgerReconciliation: 'GL-REV-COST-2026-10', notes: 'Volume +4.2%; realised price +1.1%; mix shift to enterprise accounts; one-off fibre restoration cost excluded from recurring run-rate.' }),
    ], transitions: { Draft: 'In Review', 'In Review': 'Certified', Certified: 'Published' },
  },
  {
    key: 'close-management', label: 'Period Close', title: 'Close Management', noun: 'Close Task', icon: FileBarChart, amountLabel: 'Open blocking tasks',
    columns: [{ label: 'Task', key: 'reference' }, { label: 'Close activity', key: 'title' }, { label: 'Owner', key: 'owner' }, { label: 'Due', key: 'dueDate' }, { label: 'Dependency', key: 'dependency' }, { label: 'Status', key: 'status' }],
    fields: [
      { key: 'name', label: 'Close task', required: true }, { key: 'period', label: 'Close period', required: true },
      { key: 'owner', label: 'Task owner', required: true }, { key: 'dueDate', label: 'Due date', type: 'date' },
      { key: 'dependency', label: 'Depends on', type: 'text' }, { key: 'blocking', label: 'Blocking task?', options: ['Yes', 'No'] },
      { key: 'evidence', label: 'Control evidence / completion reference', type: 'textarea', wide: true },
    ],
    seeds: [
      row('CLS-26001', 'Post inventory valuation', 'Completed', 0, 'System task · evidence attached', { name: 'Post inventory valuation', period: '2026-10', owner: 'Inventory Accounting', dueDate: '2026-11-05', dependency: 'Goods receipt accrual review', blocking: 'Yes', evidence: 'Valuation batch VAL-2026-10 completed.' }),
      row('CLS-26002', 'Review bank reconciliations', 'In Progress', 1, 'Reviewer action required before close certification', { name: 'Review bank reconciliations', period: '2026-10', owner: 'Financial Controller', dueDate: '2026-11-08', dependency: 'Bank statement import', blocking: 'Yes', evidence: 'One reconciliation remains under review.' }),
      row('CLS-26003', 'Certify intercompany eliminations', 'Pending', 1, 'Awaiting entity controller confirmation', { name: 'Certify intercompany eliminations', period: '2026-10', owner: 'Group Reporting', dueDate: '2026-11-09', dependency: 'Intercompany matching', blocking: 'Yes', evidence: '' }),
    ], transitions: { Pending: 'In Progress', 'In Progress': 'Completed' },
  },
  {
    key: 'reports-dimensions', label: 'Reports & Dimensions', title: 'Narrative Reporting & Enterprise Data', noun: 'Reporting / Dimension Record', icon: Database, amountLabel: 'Open review items',
    columns: [{ label: 'Record', key: 'reference' }, { label: 'Report / dimension', key: 'title' }, { label: 'Period / version', key: 'period' }, { label: 'Owner', key: 'owner' }, { label: 'Review items', key: 'amount' }, { label: 'Status', key: 'status' }],
    fields: [
      { key: 'name', label: 'Report or dimension name', required: true }, { key: 'recordType', label: 'Record type', options: ['Board report', 'Statutory disclosure', 'Sustainability disclosure', 'Dimension change request', 'Hierarchy version'] },
      { key: 'period', label: 'Period / effective version', required: true }, { key: 'owner', label: 'Owner / data steward', required: true },
      { key: 'reviewItems', label: 'Open review items', type: 'number' }, { key: 'sourceCells', label: 'Source cells / linked data', type: 'textarea', wide: true },
      { key: 'impact', label: 'Impact analysis / taxonomy validation', type: 'textarea', wide: true }, { key: 'notes', label: 'Narrative / change rationale', type: 'textarea', wide: true },
    ],
    seeds: [
      row('RPT-BOARD-Q3', 'Quarterly Board Performance Pack', 'Draft', 3, 'Live-bound board pack with linked source metrics and review sections', { recordType: 'Board report', period: '2026-Q3', owner: 'Corporate FP&A', reviewItems: '3', sourceCells: 'Revenue: GL 4000; EBITDA: governed metric EBITDA-01; Capex: asset register + AP.', impact: 'Three narrative sections require independent reviewer sign-off.', notes: 'Commentary separates volume, price, mix, currency and one-off effects.' }),
      row('DIM-REQ-017', 'Add Caribbean service region member', 'Pending Review', 2, 'Dimension change request with impact analysis and scheduled activation', { recordType: 'Dimension change request', period: 'Effective 2027-01-01', owner: 'Data Steward', reviewItems: '2', sourceCells: 'Dimension: Service Region; proposed member: Caribbean South.', impact: 'Impacts sales reporting, service fulfilment, workforce planning and consolidated reporting.', notes: 'Historical hierarchy remains versioned for prior-period reproduction.' }),
    ], transitions: { Draft: 'Pending Review', 'Pending Review': 'Approved', Approved: 'Published' },
  },
  {
    key: 'calculation-fabric', label: 'Calculation Fabric', title: 'Calculation Fabric Operations', noun: 'Calculation Run', icon: Activity, amountLabel: 'Calculated cells',
    columns: [{ label: 'Run', key: 'reference' }, { label: 'Model / calculation', key: 'title' }, { label: 'Version', key: 'modelVersion' }, { label: 'Cells', key: 'amount' }, { label: 'Runtime', key: 'runtime' }, { label: 'Status', key: 'status' }],
    fields: [
      { key: 'model', label: 'Model / calculation name', required: true }, { key: 'modelVersion', label: 'Model version', required: true },
      { key: 'calculationType', label: 'Calculation type', options: ['Driver propagation', 'Scenario copy-on-write', 'Aggregation', 'Optimisation', 'Validation'] },
      { key: 'cells', label: 'Populated cells processed', type: 'number' }, { key: 'runtime', label: 'Runtime (seconds)', type: 'number' },
      { key: 'writeConflicts', label: 'Write-back conflicts detected', type: 'number' }, { key: 'plan', label: 'Execution plan and reasoning', type: 'textarea', wide: true },
      { key: 'determinism', label: 'Determinism / reproducibility evidence', type: 'textarea', wide: true },
    ],
    seeds: [
      row('CALC-2026-091', 'FY2027 Integrated Plan Recalculation', 'Completed', 1284000, 'Illustrative sparse-cell calculation run', { model: 'FY2027 Integrated Plan', modelVersion: 'v1.8', calculationType: 'Driver propagation', cells: '1284000', runtime: '0.74', writeConflicts: '0', plan: 'Sparse populated cells; materialised aggregation for consolidated totals; on-read evaluation for scenario-specific cells.', determinism: 'Same input values and model version produced a repeatable result in the demo.' }),
    ], transitions: { Draft: 'Queued', Queued: 'Running', Running: 'Completed' },
  },
];

const workspaces: Record<string, WorkspaceConfig> = {
  '/finance/management-accounting': {
    title: 'Management Accounting',
    subtitle: 'Understand where value is consumed and created through cost objects, responsibility accounting, internal orders, product costing and activity-based allocations.',
    views: managementViews,
    connectorNote: 'Cost and profit centre results are illustrative management views. Internal allocation entries are modelled separately from primary ledger costs to avoid presenting internal flows as external statutory expense.',
  },
  '/finance/epm': {
    title: 'Enterprise Performance Management',
    subtitle: 'Plan, forecast, consolidate, reconcile and close using a connected planning model, shared dimensions and controlled calculation workflows.',
    views: epmViews,
    connectorNote: 'Planning, scenario merges, consolidation, reconciliations and close controls are simulated. A hard-close action is blocked while a blocking close task remains open; no statutory ledger or filing is posted.',
  },
};

function displayValue(record: BusinessRecord, key: string): string {
  if (key === 'reference') return record.reference;
  if (key === 'title') return record.title;
  if (key === 'status') return record.status;
  if (key === 'amount') return formatCurrency(record.amount);
  return record.fields[key] || '—';
}

function sumFields(fields: Record<string, string>, keys: string[]): number {
  return keys.reduce((sum, key) => sum + (Number(fields[key]) || 0), 0);
}

export function FinancePlanningWorkspace({ pathname }: { pathname: string }) {
  const config = workspaces[pathname];
  const storageKey = `radium-phase6:${pathname}`;
  const [recordsByView, setRecordsByView] = useState<Record<string, BusinessRecord[]>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved) as Record<string, BusinessRecord[]>;
    } catch { /* use illustrative defaults when browser storage is unavailable */ }
    return Object.fromEntries(config.views.map((view) => [view.key, view.seeds]));
  });
  const [activeView, setActiveView] = useState(config.views[0].key);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<BusinessRecord | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [toast, setToast] = useState('');
  const [closeLocked, setCloseLocked] = useState(false);
  const view = config.views.find((item) => item.key === activeView) ?? config.views[0];
  const records = recordsByView[view.key] ?? view.seeds;
  const Icon = view.icon;

  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(recordsByView)); }, [recordsByView, storageKey]);
  useEffect(() => { setQuery(''); setStatusFilter('All statuses'); setSelected(null); setFormOpen(false); }, [activeView]);

  const filtered = useMemo(() => records.filter((item) => {
    const statusMatch = statusFilter === 'All statuses' || item.status === statusFilter;
    const searchText = [item.reference, item.title, item.description, ...Object.values(item.fields)].join(' ').toLowerCase();
    return statusMatch && searchText.includes(query.toLowerCase());
  }), [records, query, statusFilter]);

  const allRecords = config.views.flatMap((item) => recordsByView[item.key] ?? item.seeds);
  const pending = allRecords.filter((item) => ['Pending Approval', 'Pending Review', 'In Review', 'Submitted', 'Prepared', 'In Progress', 'Draft'].includes(item.status)).length;
  const activeCount = allRecords.filter((item) => ['Active', 'Approved', 'Released', 'Published', 'Completed', 'Certified', 'Posted', 'Merged'].includes(item.status)).length;
  const closeTasks = recordsByView['close-management'] ?? epmViews.find((item) => item.key === 'close-management')?.seeds ?? [];
  const openBlocking = closeTasks.filter((item) => item.fields.blocking === 'Yes' && item.status !== 'Completed').length;
  const currentTotal = records.reduce((sum, item) => sum + item.amount, 0);

  const openNew = () => { setEditingId(null); setForm({}); setSelected(null); setFormOpen(true); };
  const openEdit = (record: BusinessRecord) => { setEditingId(record.id); setForm({ ...record.fields }); setSelected(null); setFormOpen(true); };
  const replaceRecord = (record: BusinessRecord) => setRecordsByView((previous) => ({ ...previous, [view.key]: (previous[view.key] ?? view.seeds).map((item) => item.id === record.id ? record : item) }));

  const save = (submit: boolean) => {
    const missing = view.fields.find((field) => field.required && !form[field.key]?.trim());
    if (missing) { setToast(`${missing.label} is required.`); return; }
    const old = records.find((item) => item.id === editingId);
    const reference = old?.reference ?? `${view.key.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4)}-${String(Date.now()).slice(-6)}`;
    let amount = Number(form.revenueImpact ?? form.revenue ?? form.actual ?? form.ledgerBalance ?? form.cells ?? form.reviewItems ?? 0);
    if (view.key === 'profit-centres') amount = sumFields(form, ['revenue']) - sumFields(form, ['variableCost', 'directFixed', 'allocatedOverhead']);
    if (view.key === 'profitability-analysis') amount = sumFields(form, ['revenue']) - sumFields(form, ['variableCost', 'directFixed', 'overhead']);
    if (view.key === 'rolling-forecast') amount = sumFields(form, ['baselineRevenue', 'revenueOverride']);
    if (view.key === 'product-costing') amount = sumFields(form, ['material', 'labour', 'machine', 'overhead', 'scrap']);
    if (view.key === 'activity-allocations') amount = (Number(form.quantity) || 0) * (Number(form.rate) || 0);
    if (view.key === 'reconciliations') amount = Number(form.unmatched || 0);
    if (view.key === 'internal-orders' && Number(form.actual || 0) > Number(form.budget || 0) * (1 + (Number(form.tolerance || 0) / 100))) {
      setToast('Budget availability control failed: actual spend exceeds the permitted tolerance.'); return;
    }
    const title = form.name || form.segmentName || form.product || form.activity || form.forecastPeriod || form.period || form.model || view.noun;
    const description = form.notes || form.drivers || form.shock || form.evidence || form.variance || `${view.noun} record`;
    const firstWorkflowStatus = view.transitions.Draft ?? (view.key === 'close-management' ? 'Pending' : 'Draft');
    const status = submit ? (old ? (old.status === 'Draft' ? firstWorkflowStatus : old.status) : firstWorkflowStatus) : (old?.status || 'Draft');
    const updated: BusinessRecord = {
      id: old?.id ?? reference, reference, title, date: form.validFrom || form.effectiveDate || form.cycleDate || form.dueDate || today,
      status, amount: Number.isFinite(amount) ? amount : 0, description, fields: { ...form },
      history: [...(old?.history ?? []), ...history(old ? 'Updated record' : submit ? 'Submitted for review' : 'Saved draft')],
    };
    setRecordsByView((previous) => ({ ...previous, [view.key]: old ? (previous[view.key] ?? view.seeds).map((item) => item.id === old.id ? updated : item) : [updated, ...(previous[view.key] ?? view.seeds)] }));
    setFormOpen(false); setEditingId(null); setToast(submit ? `${view.noun} submitted for review.` : `${view.noun} saved as draft.`);
  };

  const transition = (record: BusinessRecord, to: string) => {
    if (view.key === 'scenarios' && to === 'Merged' && !record.fields.mergeReason?.trim()) { setToast('Add a merge rationale before merging this scenario into the consensus version.'); return; }
    const updated = { ...record, status: to, history: [...record.history, ...history(`Status changed to ${to}`)] };
    replaceRecord(updated); setSelected(updated); setToast(`${record.reference} moved to ${to}.`);
  };

  const hardClose = () => {
    if (openBlocking > 0) { setToast(`Hard close blocked: ${openBlocking} blocking task(s) remain unresolved.`); return; }
    setCloseLocked(true); setToast('Period close simulated as locked.');
  };

  const runAction = (record: BusinessRecord) => {
    if (view.key === 'calculation-fabric') {
      const updated = { ...record, status: 'Completed', history: [...record.history, ...history('Calculation run simulated; deterministic output recorded')] };
      replaceRecord(updated); setSelected(updated); setToast(`${record.reference} calculation completed in the demo.`); return;
    }
    if (view.key === 'scenarios' && record.status === 'Ready to Merge') { transition(record, 'Merged'); return; }
    const next = view.transitions[record.status];
    if (next) transition(record, next);
  };

  return <div className="page-stack phase4-workspace phase5-workspace phase6-workspace">
    <SectionHeading eyebrow="PHASE 6 · FINANCE & PERFORMANCE PLANNING" title={config.title} subtitle={config.subtitle} action={<span className="phase-chip">Demo environment · Local persistence</span>} />
    <div className="demo-banner"><div className="demo-banner-icon"><ShieldCheck size={17} /></div><div><strong>Interactive prototype · simulated finance controls</strong><span>Business records, approvals, scenario actions and close controls are saved in this browser. No live ledger posting, statutory consolidation, external filing or production calculation service is connected.</span></div><span className="demo-pill">DEMO</span></div>
    <div className="finance-metric-grid phase4-metrics">
      <div className="panel finance-metric"><span>Records in module</span><strong>{allRecords.length}</strong><small>{config.views.length} functional workspaces</small></div>
      <div className="panel finance-metric"><span>Open / review items</span><strong>{pending}</strong><small>Drafts, submissions and in-progress work</small></div>
      <div className="panel finance-metric"><span>Completed / approved</span><strong>{activeCount}</strong><small>Released, certified or completed records</small></div>
      <div className="panel finance-metric"><span>{view.amountLabel}</span><strong>{formatCurrency(currentTotal)}</strong><small>Illustrative total in current register</small></div>
    </div>

    <div className="panel phase6-subnav-panel">
      <div className="phase6-subnav-heading"><div><span className="eyebrow">WORKSPACE NAVIGATION</span><strong>{config.title} capabilities</strong></div><span>{config.views.length} workspaces</span></div>
      <div className="phase6-subnav">{config.views.map((item) => { const TabIcon = item.icon; return <button key={item.key} className={`phase6-tab ${activeView === item.key ? 'active' : ''}`} onClick={() => setActiveView(item.key)}><TabIcon size={15} /><span>{item.label}</span></button>; })}</div>
    </div>

    <section className="panel transactions-panel">
      <div className="panel-heading phase4-heading"><div><h2><Icon size={18} /> {view.title}</h2><p>Maintain governed records, open details and activity, and manage the workflow lifecycle.</p></div><button className="btn btn-primary" onClick={openNew}><Plus size={15} /> New {view.noun}</button></div>
      <div className="finance-toolbar"><label className="finance-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${view.label.toLowerCase()}...`} /></label><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status"><option>All statuses</option>{Array.from(new Set(records.map((item) => item.status))).sort().map((item) => <option key={item}>{item}</option>)}</select></div>
      <div className="table-wrap"><table className="data-table"><thead><tr>{view.columns.map((column) => <th key={column.key}>{column.label.toUpperCase()}</th>)}<th>DETAIL</th></tr></thead><tbody>
        {filtered.map((item) => <tr key={item.id} className="clickable-row" onClick={() => setSelected(item)}>{view.columns.map((column) => <td key={column.key}>{column.key === 'status' ? <StatusBadge status={item.status} /> : column.key === 'amount' ? <strong>{formatCurrency(item.amount)}</strong> : column.key === 'reference' ? <strong>{item.reference}</strong> : column.key === 'title' ? <><strong>{item.title}</strong><small className="finance-subline">{item.description}</small></> : <span>{displayValue(item, column.key)}</span>}</td>)}<td><button className="icon-action" aria-label={`View ${item.reference}`} onClick={(event) => { event.stopPropagation(); setSelected(item); }}><ArrowRight size={15} /></button></td></tr>)}
      </tbody></table>{filtered.length === 0 && <div className="finance-empty"><Search size={22} /><strong>No matching records</strong><span>Change the search text or status filter.</span></div>}</div>
      <div className="table-bottom"><span>{filtered.length} of {records.length} records shown</span><span>Local demo register · changes persist in this browser</span></div>
    </section>

    {pathname === '/finance/epm' && view.key === 'close-management' && <div className="panel phase6-close-control"><div><span className="eyebrow">PERIOD CONTROL</span><h3>Hard close readiness</h3><p>{openBlocking} blocking task(s) remain unresolved in the current close register.</p></div><div className="phase6-close-action"><StatusBadge status={closeLocked ? 'Locked' : openBlocking ? 'On hold' : 'Ready'} /><button className="btn btn-primary" disabled={closeLocked} onClick={hardClose}> <ShieldCheck size={15} /> {closeLocked ? 'Period locked' : 'Lock period'}</button></div></div>}

    <div className="finance-control-note"><Activity size={17} /><span><strong>Control context:</strong> {config.connectorNote}</span></div>

    {formOpen && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setFormOpen(false)}><div className="finance-modal phase4-modal" role="dialog" aria-modal="true" aria-label={`${editingId ? 'Edit' : 'Create'} ${view.noun}`}>
      <div className="finance-modal-header"><div><span className="eyebrow">{editingId ? 'EDIT RECORD' : 'NEW FINANCE / PLANNING RECORD'}</span><h2>{editingId ? 'Edit' : 'Create'} {view.noun}</h2><p>Complete the business fields. Required fields are marked.</p></div><button className="close-button" onClick={() => setFormOpen(false)} aria-label="Close form"><X size={18} /></button></div>
      <div className="finance-form-body"><div className="finance-form-grid">{view.fields.map((field) => <label key={field.key} className={field.wide ? 'wide' : ''}>{field.label}{field.required ? ' *' : ''}{field.options ? <select value={form[field.key] || ''} onChange={(event) => setForm((previous) => ({ ...previous, [field.key]: event.target.value }))}><option value="">Select...</option>{field.options.map((option) => <option key={option}>{option}</option>)}</select> : field.type === 'textarea' ? <textarea rows={3} value={form[field.key] || ''} onChange={(event) => setForm((previous) => ({ ...previous, [field.key]: event.target.value }))} /> : <input type={field.type || 'text'} min={field.type === 'number' ? 0 : undefined} step={field.type === 'number' ? 'any' : undefined} value={form[field.key] || ''} onChange={(event) => setForm((previous) => ({ ...previous, [field.key]: event.target.value }))} />}</label>)}</div></div>
      <div className="finance-modal-footer"><button className="btn btn-secondary" onClick={() => setFormOpen(false)}>Cancel</button><button className="btn btn-secondary" onClick={() => save(false)}>Save draft</button><button className="btn btn-primary" onClick={() => save(true)}><Send size={15} /> Submit for review</button></div>
    </div></div>}

    {selected && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}><div className="finance-modal detail-finance-modal" role="dialog" aria-modal="true" aria-label="Record details">
      <div className="finance-modal-header"><div><span className="eyebrow">{view.noun.toUpperCase()} · {selected.reference}</span><h2>{selected.title}</h2><p>{selected.description}</p></div><button className="close-button" onClick={() => setSelected(null)} aria-label="Close details"><X size={18} /></button></div>
      <div className="finance-detail-body"><div className="finance-detail-amount"><span>{view.amountLabel}</span><strong>{formatCurrency(selected.amount)}</strong><StatusBadge status={selected.status} /></div><div className="finance-detail-grid">{Object.entries(selected.fields).filter(([, value]) => value !== '').map(([key, value]) => <div key={key}><span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase())}</span><strong>{value}</strong></div>)}<div><span>Record date</span><strong>{formatDate(selected.date)}</strong></div><div><span>Reference</span><strong>{selected.reference}</strong></div></div>
        <div className="finance-history"><strong>Activity history</strong>{selected.history.map((entry, index) => <div className="finance-history-row" key={`${entry.action}-${index}`}><span className="history-dot" /><div><strong>{entry.action}</strong><small>{entry.by} · {entry.at}</small></div></div>)}</div>
        <div className="finance-validation-note"><ShieldCheck size={16} /><span>Simulated finance / planning record. Changes remain in this browser and do not update the production ledger or external consolidation services.</span></div>
      </div>
      <div className="finance-modal-footer"><button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>{(selected.status === 'Draft' || (view.key === 'scenarios' && selected.status !== 'Merged')) && <button className="btn btn-secondary" onClick={() => openEdit(selected)}>Edit record</button>}{selected.status === 'Pending Approval' && <button className="btn btn-secondary" onClick={() => transition(selected, 'Rejected')}>Reject</button>}{view.transitions[selected.status] && <button className="btn btn-primary" onClick={() => runAction(selected)}>{view.transitions[selected.status] === 'Merged' ? <GitBranch size={15} /> : <Check size={15} />}{view.transitions[selected.status] === 'Merged' ? 'Merge to consensus' : `Advance to ${view.transitions[selected.status]}`}</button>}{view.key === 'calculation-fabric' && <button className="btn btn-primary" onClick={() => runAction(selected)}><Sparkles size={15} /> Run calculation</button>}</div>
    </div></div>}
    {toast && <div className="toast-message"><Check size={16} />{toast}<button onClick={() => setToast('')} aria-label="Dismiss"><X size={14} /></button></div>}
  </div>;
}
