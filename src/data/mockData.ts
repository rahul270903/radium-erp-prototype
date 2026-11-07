export type TransactionStatus = 'Approved' | 'Pending approval' | 'Draft' | 'Posted' | 'In progress' | 'Paid' | 'Partially paid';

export type Transaction = {
  id: string;
  reference: string;
  type: string;
  description: string;
  party: string;
  date: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  owner: string;
};

export const transactions: Transaction[] = [
  { id: 't-001', reference: 'PO-2026-0842', type: 'Purchase order', description: 'Optical fibre cable — 24 core', party: 'Caribbean Network Supply', date: '2026-11-07', amount: 48600, currency: 'USD', status: 'Pending approval', owner: 'M. Clarke' },
  { id: 't-002', reference: 'INV-2026-3198', type: 'Supplier invoice', description: 'Warehouse equipment lease', party: 'Island Industrial Ltd.', date: '2026-11-07', amount: 12850, currency: 'USD', status: 'Approved', owner: 'A. Bennett' },
  { id: 't-003', reference: 'JE-2026-1176', type: 'Journal entry', description: 'October accrual adjustment', party: 'Finance Operations', date: '2026-11-06', amount: 32400, currency: 'USD', status: 'Draft', owner: 'R. Morgan' },
  { id: 't-004', reference: 'SO-2026-2051', type: 'Sales order', description: 'Enterprise connectivity rollout', party: 'Northshore Business Group', date: '2026-11-06', amount: 92750, currency: 'USD', status: 'In progress', owner: 'J. Campbell' },
  { id: 't-005', reference: 'REC-2026-1407', type: 'Payment receipt', description: 'Customer settlement — INV-3091', party: 'Bluewater Communications', date: '2026-11-05', amount: 18200, currency: 'USD', status: 'Posted', owner: 'A. Bennett' },
  { id: 't-006', reference: 'GRN-2026-0654', type: 'Goods receipt', description: 'Network cabinets and fittings', party: 'Caribbean Network Supply', date: '2026-11-05', amount: 21300, currency: 'USD', status: 'Approved', owner: 'D. Williams' },
  { id: 't-007', reference: 'EXP-2026-0922', type: 'Expense claim', description: 'Regional site inspection travel', party: 'K. Thompson', date: '2026-11-04', amount: 740, currency: 'USD', status: 'Pending approval', owner: 'K. Thompson' },
  { id: 't-008', reference: 'WO-2026-0388', type: 'Maintenance work order', description: 'Generator preventive maintenance', party: 'Kingston Distribution Centre', date: '2026-11-04', amount: 1650, currency: 'USD', status: 'In progress', owner: 'S. Reid' },
];

export const approvals = [
  { id: 'APR-0921', title: 'Purchase order approval', detail: 'PO-2026-0842 · Caribbean Network Supply', amount: '$48,600', age: '12 min ago', priority: 'High', kind: 'Approval' },
  { id: 'APR-0918', title: 'Expense claim review', detail: 'EXP-2026-0922 · K. Thompson', amount: '$740', age: '48 min ago', priority: 'Normal', kind: 'Approval' },
  { id: 'TSK-0440', title: 'Review supplier invoice match', detail: 'INV-2026-3189 · 2-way match exception', amount: 'Action required', age: '2 hours ago', priority: 'High', kind: 'Task' },
];

export const monthlyPerformance = [
  { month: 'Jun', revenue: 312, expenses: 184 },
  { month: 'Jul', revenue: 338, expenses: 196 },
  { month: 'Aug', revenue: 326, expenses: 201 },
  { month: 'Sep', revenue: 371, expenses: 213 },
  { month: 'Oct', revenue: 395, expenses: 229 },
  { month: 'Nov', revenue: 418, expenses: 237 },
];

export const cashFlow = [
  { month: 'Jun', inflow: 520, outflow: 385 },
  { month: 'Jul', inflow: 545, outflow: 402 },
  { month: 'Aug', inflow: 532, outflow: 411 },
  { month: 'Sep', inflow: 578, outflow: 428 },
  { month: 'Oct', inflow: 603, outflow: 449 },
  { month: 'Nov', inflow: 621, outflow: 462 },
];

export const operationalPulse = [
  { label: 'Purchase orders', count: 42, meta: '11 awaiting receipt', icon: 'shopping-cart', color: 'blue' },
  { label: 'Goods receipts', count: 18, meta: '4 inspections due', icon: 'package-check', color: 'teal' },
  { label: 'Open work orders', count: 27, meta: '6 scheduled today', icon: 'wrench', color: 'amber' },
  { label: 'Active projects', count: 16, meta: '3 milestones this week', icon: 'briefcase', color: 'violet' },
];

export const notifications = [
  { id: 'n-1', title: 'Approval required', body: 'PO-2026-0842 is waiting for your review.', time: '12 min ago', unread: true, tone: 'blue' },
  { id: 'n-2', title: 'Integration notice', body: 'ARIA customer sync completed for 18 records.', time: '34 min ago', unread: true, tone: 'green' },
  { id: 'n-3', title: 'Inventory exception', body: 'Low-stock threshold reached for fibre optic connectors.', time: '1 hour ago', unread: true, tone: 'amber' },
  { id: 'n-4', title: 'Daily close reminder', body: 'Review cash reconciliation before end of day.', time: '3 hours ago', unread: false, tone: 'gray' },
];
