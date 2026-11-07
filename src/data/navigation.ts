import type { LucideIcon } from 'lucide-react';
import {
  Activity, Archive, BadgeDollarSign, Banknote, Boxes, Briefcase, Building2,
  Calculator, BarChart3, ClipboardCheck, ClipboardList, CreditCard, Factory,
  FileBarChart, FileCheck2, FileText, Gauge, Globe2, HardHat, HeartHandshake, Landmark,
  Layers, LifeBuoy, Package, PackageCheck, Pickaxe, Receipt, Route, ScanBarcode,
  Settings, ShieldCheck, ShoppingBag, ShoppingCart, Sparkles, Truck, Users, Warehouse, Wrench,
} from 'lucide-react';

export type ModuleLink = { label: string; path: string; description: string; icon?: LucideIcon; phase: string };
export type NavGroup = { label: string; icon: LucideIcon; modules: ModuleLink[] };

export const navGroups: NavGroup[] = [
  {
    label: 'Finance & Planning', icon: Landmark, modules: [
      { label: 'General Ledger', path: '/finance/general-ledger', description: 'Writable journal entries, accounting dimensions, approval control and Subledger Accounting traceability.', icon: Calculator, phase: 'Phase 2' },
      { label: 'Subledger Accounting', path: '/finance/subledger', description: 'Accounting rules and traceable journal creation from operational events.', icon: Layers, phase: 'Phase 2' },
      { label: 'Accounts Payable', path: '/finance/accounts-payable', description: 'Supplier invoice capture, duplicate checks, matching, approval and payment eligibility.', icon: Receipt, phase: 'Phase 2' },
      { label: 'Accounts Receivable', path: '/finance/accounts-receivable', description: 'Customer invoices, incoming receipts, cash application and receivables control.', icon: CreditCard, phase: 'Phase 2' },
      { label: 'Fixed Assets', path: '/finance/fixed-assets', description: 'Acquisition, capitalisation, depreciation and asset accounting.', icon: Archive, phase: 'Phase 4' },
      { label: 'Lease Accounting', path: '/finance/lease-accounting', description: 'Lease contracts, schedules, measurement and accounting.', icon: FileText, phase: 'Later phase' },
      { label: 'Bank & Cash Management', path: '/finance/bank-cash', description: 'Bank accounts, liquidity positions, statements and reconciliation.', icon: Banknote, phase: 'Phase 2' },
      { label: 'Treasury & Risk', path: '/finance/treasury', description: 'Treasury operations, liquidity and financial risk management.', icon: Activity, phase: 'Later phase' },
      { label: 'Revenue Recognition', path: '/finance/revenue-recognition', description: 'Revenue schedules linked to contracts, orders and billing events.', icon: BarChart3, phase: 'Phase 2' },
      { label: 'Tax Management', path: '/finance/tax', description: 'Tax determination, calculation and reporting controls.', icon: FileCheck2, phase: 'Phase 2' },
      { label: 'Expense Management', path: '/finance/expenses', description: 'Employee expense claims, receipt evidence, policy checks and approval routing.', icon: Receipt, phase: 'Phase 2' },
      { label: 'Intercompany Accounting', path: '/finance/intercompany', description: 'Group-company transactions, matching, netting and settlement.', icon: Building2, phase: 'Later phase' },
      { label: 'Management Accounting', path: '/finance/management-accounting', description: 'Cost centres, profit centres, internal orders, product costing and activity-based allocations.', icon: Calculator, phase: 'Phase 6' },
      { label: 'Enterprise Performance', path: '/finance/epm', description: 'Planning, budgeting, scenarios, consolidation, reconciliation, period close and governed reporting.', icon: FileBarChart, phase: 'Phase 6' },
    ],
  },
  {
    label: 'Procurement & Supply', icon: ShoppingCart, modules: [
      { label: 'Purchase Requisitions', path: '/procurement/requisitions', description: 'Internal requests to buy linked to a project, employee or inventory need.', icon: ClipboardList, phase: 'Phase 3' },
      { label: 'Purchase Orders', path: '/procurement/purchase-orders', description: 'Supplier orders, commitments, revisions and acknowledgement.', icon: ShoppingCart, phase: 'Phase 3' },
      { label: 'Supplier Management', path: '/procurement/suppliers', description: 'Supplier onboarding, qualification and performance information.', icon: Users, phase: 'Phase 3' },
      { label: 'Sourcing & Contracts', path: '/procurement/sourcing', description: 'Sourcing events, bids, tenders and procurement contracts.', icon: FileCheck2, phase: 'Later phase' },
      { label: 'Invoice Verification', path: '/procurement/invoice-verification', description: 'Supplier invoice verification and purchase-order / receipt matching.', icon: Receipt, phase: 'Phase 2' },
      { label: 'Spend Analysis', path: '/procurement/spend-analysis', description: 'Procurement spending patterns and supplier analytics.', icon: BarChart3, phase: 'Later phase' },
      { label: 'Supply Planning', path: '/supply/planning', description: 'Demand, replenishment and supply planning across locations.', icon: Package, phase: 'Later phase' },
    ],
  },
  {
    label: 'Inventory & Warehouse', icon: Warehouse, modules: [
      { label: 'Inventory Management', path: '/inventory/management', description: 'Multi-location stock quantities, valuation and inventory status.', icon: Boxes, phase: 'Phase 3' },
      { label: 'Material Valuation', path: '/inventory/valuation', description: 'Material valuation and inventory cost visibility.', icon: BadgeDollarSign, phase: 'Phase 3' },
      { label: 'Warehouse Operations', path: '/warehouse/operations', description: 'Warehouse structure, receiving, put-away, picking and packing.', icon: Warehouse, phase: 'Phase 3' },
      { label: 'Goods Receipts', path: '/warehouse/goods-receipts', description: 'Inbound receiving, receipt inspection and put-away handoff.', icon: PackageCheck, phase: 'Phase 3' },
      { label: 'Inventory Transfers', path: '/inventory/transfers', description: 'Stock movement between warehouses and storage locations.', icon: Route, phase: 'Phase 3' },
      { label: 'Inventory Adjustments', path: '/inventory/adjustments', description: 'Cycle-count variances and controlled inventory adjustments.', icon: ClipboardCheck, phase: 'Phase 3' },
      { label: 'Transportation & Logistics', path: '/logistics/transportation', description: 'Freight planning, carrier management and shipment tracking.', icon: Truck, phase: 'Phase 5' },
    ],
  },
  {
    label: 'Sales & Distribution', icon: Briefcase, modules: [
      { label: 'Customer Master', path: '/sales/customer-master', description: 'ERP customer master records and commercial account attributes.', icon: Building2, phase: 'Phase 4' },
      { label: 'Sales Orders', path: '/sales/orders', description: 'Order capture, availability, credit review and fulfilment handoff.', icon: ShoppingBag, phase: 'Phase 4' },
      { label: 'Pricing & Credit', path: '/sales/pricing-credit', description: 'Pricing conditions, discounts and credit-risk controls.', icon: BadgeDollarSign, phase: 'Phase 4' },
      { label: 'Shipping & Billing', path: '/sales/shipping-billing', description: 'Delivery execution, billing, invoicing and rebates.', icon: Truck, phase: 'Phase 4' },
    ],
  },
  {
    label: 'Manufacturing & Quality', icon: Factory, modules: [
      { label: 'Product Engineering', path: '/manufacturing/product-engineering', description: 'Product data, bills of material, routing and engineering changes.', icon: Pickaxe, phase: 'Phase 5' },
      { label: 'Production Planning', path: '/manufacturing/production-planning', description: 'Production orders, capacity planning and shop-floor control.', icon: Factory, phase: 'Phase 5' },
      { label: 'Quality Management', path: '/quality/management', description: 'Inspection plans, non-conformance, corrective action and traceability.', icon: ShieldCheck, phase: 'Phase 5' },
    ],
  },
  {
    label: 'Assets & Service', icon: Wrench, modules: [
      { label: 'Asset Management', path: '/assets/management', description: 'Asset register, location, lifecycle and reliability information.', icon: Archive, phase: 'Phase 4' },
      { label: 'Maintenance Work Orders', path: '/assets/work-orders', description: 'Preventive and corrective maintenance, labour and parts allocation.', icon: Wrench, phase: 'Phase 4' },
      { label: 'Service & Field Service', path: '/service/field-service', description: 'Service orders, scheduling, field execution, warranty and returns.', icon: LifeBuoy, phase: 'Phase 5' },
    ],
  },
  {
    label: 'People & Projects', icon: Users, modules: [
      { label: 'Human Capital Management', path: '/people/hcm', description: 'Personnel, organisation, attendance, payroll and workforce planning.', icon: Users, phase: 'Phase 5' },
      { label: 'Project Management', path: '/projects/management', description: 'Project structure, cost, billing, control and resource management.', icon: Briefcase, phase: 'Phase 4' },
    ],
  },
  {
    label: 'EHS & Compliance', icon: HardHat, modules: [
      { label: 'Environment, Health & Safety', path: '/ehs/management', description: 'Safety planning, inspections, incidents, risk and environmental compliance.', icon: HardHat, phase: 'Phase 5' },
    ],
  },
  {
    label: 'Retail & Edge', icon: ScanBarcode, modules: [
      { label: 'Retail POS', path: '/retail/pos', description: 'Point of sale, self-checkout, mobile commerce, kiosk, Scan & Go, offline retail, payments, fiscalisation and hospitality operations.', icon: ScanBarcode, phase: 'Phase 7 · Final' },
    ],
  },
  {
    label: 'Platform & Administration', icon: Settings, modules: [
      { label: 'Workflow & Approvals', path: '/platform/workflows', description: 'Workflow orchestration, human approval gates and business rules.', icon: ClipboardCheck, phase: 'Phase 7 · Final' },
      { label: 'Identity & Access', path: '/platform/identity', description: 'Identity, role-based access and tenant isolation.', icon: ShieldCheck, phase: 'Phase 7 · Final' },
      { label: 'Integration Gateway', path: '/platform/integrations', description: 'API, event, connector and external-system integration status.', icon: Globe2, phase: 'Phase 7 · Final' },
      { label: 'Analytics & Metrics', path: '/platform/analytics', description: 'Governed metrics, analytics and standard report packs.', icon: BarChart3, phase: 'Phase 7 · Final' },
      { label: 'Audit Trail', path: '/platform/audit', description: 'Tamper-evident history of business and system actions.', icon: FileText, phase: 'Phase 7 · Final' },
      { label: 'AI Governance', path: '/platform/ai-governance', description: 'Agent identity, autonomy limits, approval controls and explainability.', icon: Gauge, phase: 'Phase 7 · Final' },
    ],
  },
  {
    label: 'AI & Agents', icon: Sparkles, modules: [
      { label: 'Agent Registry', path: '/ai/agents', description: 'Specialist AI agents, governed digital employees, autonomy limits and approval controls.', icon: Sparkles, phase: 'Phase 7 · Final' },
    ],
  },
  {
    label: 'ARIA Integration', icon: HeartHandshake, modules: [
      { label: 'Connected CRM Records', path: '/integrations/aria', description: 'References to ARIA customers, opportunities, cases and invoices.', icon: HeartHandshake, phase: 'Phase 7 · Final' },
    ],
  },
];

export const allModules = navGroups.flatMap((group) => group.modules.map((module) => ({ ...module, group: group.label })));
