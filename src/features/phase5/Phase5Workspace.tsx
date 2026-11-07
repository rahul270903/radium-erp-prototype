import { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowRight, BadgeCheck, Boxes, Check, ClipboardCheck, Factory, HardHat, LifeBuoy, Plus, Search, Send, ShieldCheck, Truck, Users, X, type LucideIcon } from 'lucide-react';
import { SectionHeading } from '../../components/SectionHeading';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency, formatDate } from '../../lib/format';

type HistoryEntry = { action: string; by: string; at: string };
type RecordItem = { id: string; reference: string; title: string; date: string; status: string; amount: number; description: string; fields: Record<string, string>; history: HistoryEntry[] };
type Field = { key: string; label: string; required?: boolean; type?: 'text' | 'date' | 'number' | 'email' | 'textarea'; options?: string[]; wide?: boolean };
type Column = { label: string; key: string };
type Config = { title: string; subtitle: string; noun: string; icon: LucideIcon; amountLabel: string; amountKey: string; amountType?: 'currency' | 'quantity'; columns: Column[]; fields: Field[]; seeds: RecordItem[] };

const today = new Date().toISOString().slice(0, 10);
const hist = (action: string): HistoryEntry[] => [{ action, by: 'Demo user', at: new Date().toLocaleString() }];
const rec = (reference: string, title: string, status: string, amount: number, description: string, fields: Record<string, string>): RecordItem => ({ id: reference, reference, title, date: today, status, amount, description, fields, history: hist('Created as illustrative sample data') });

const configs: Record<string, Config> = {
  '/manufacturing/product-engineering': {
    title: 'Product Engineering', subtitle: 'Govern product definitions, revision-controlled bills of material, routings and engineering changes before release to operations.', noun: 'Product / Engineering Change', icon: Boxes, amountLabel: 'Standard unit cost', amountKey: 'standardCost',
    columns: [{ label: 'Product', key: 'title' }, { label: 'Product class', key: 'productClass' }, { label: 'Revision', key: 'revision' }, { label: 'Lifecycle', key: 'lifecycle' }, { label: 'Cost', key: 'amount' }, { label: 'Status', key: 'status' }],
    fields: [
      { key: 'productCode', label: 'Product code', required: true }, { key: 'name', label: 'Product name', required: true },
      { key: 'productClass', label: 'Product class', options: ['Finished good', 'Semi-finished', 'Component', 'Service item', 'Configurable product'] },
      { key: 'lifecycle', label: 'Lifecycle phase', options: ['Design', 'Prototype', 'Released', 'Obsolete'] }, { key: 'revision', label: 'Product revision', required: true },
      { key: 'baseUnit', label: 'Base unit', options: ['Each', 'Metre', 'Kilogram', 'Litre', 'Set'] }, { key: 'bomRevision', label: 'BOM revision' },
      { key: 'bomComponents', label: 'Bill of materials / component quantities', type: 'textarea', wide: true }, { key: 'routing', label: 'Routing / work-centre sequence', type: 'textarea', wide: true },
      { key: 'standardCost', label: 'Standard unit cost (USD)', type: 'number' }, { key: 'effectivity', label: 'Effective from', type: 'date' },
      { key: 'compliance', label: 'Product compliance / traceability', type: 'textarea', wide: true }, { key: 'changeReason', label: 'Engineering change rationale', type: 'textarea', wide: true }, { key: 'affectedOrders', label: 'Affected open orders / installed base', type: 'textarea', wide: true }, { key: 'inventoryImpact', label: 'Inventory disposition / effectivity impact', type: 'textarea', wide: true },
    ],
    seeds: [
      rec('PRD-10042', 'Outdoor Fibre Distribution Cabinet', 'Released', 1850, 'Revision C · production BOM released', { productCode: 'PRD-10042', productClass: 'Finished good', lifecycle: 'Released', revision: 'C', baseUnit: 'Each', bomRevision: 'BOM-C', bomComponents: 'Enclosure × 1\nSplice tray × 4\nCable management kit × 1\nGrounding kit × 1', routing: 'Assembly cell → Wiring bench → Final inspection', standardCost: '1850', effectivity: '2026-10-01', compliance: 'IP-rated enclosure; serial traceability required', changeReason: 'Approved production revision' }),
      rec('PRD-10057', 'Fibre Access Terminal 16-Port', 'Pending Approval', 420, 'Revision B · connector layout change submitted', { productCode: 'PRD-10057', productClass: 'Finished good', lifecycle: 'Prototype', revision: 'B', baseUnit: 'Each', bomRevision: 'BOM-B', bomComponents: 'Housing × 1\nAdapter panel × 1\nSC/APC adapter × 16', routing: 'Mechanical assembly → Optical test → Pack', standardCost: '420', effectivity: '2026-11-15', compliance: 'Optical loss test record required', changeReason: 'Connector layout update' }),
    ],
  },
  '/manufacturing/production-planning': {
    title: 'Production Planning', subtitle: 'Plan production orders against product revisions, material readiness, work-centre capacity and target output.', noun: 'Production Order', icon: Factory, amountLabel: 'Planned production cost', amountKey: 'plannedCost',
    columns: [{ label: 'Production order', key: 'reference' }, { label: 'Product', key: 'product' }, { label: 'Quantity', key: 'quantity' }, { label: 'Work centre', key: 'workCentre' }, { label: 'Start date', key: 'startDate' }, { label: 'Status', key: 'status' }],
    fields: [
      { key: 'orderType', label: 'Order type', options: ['Make to stock', 'Make to order', 'Rework', 'Pilot batch'] }, { key: 'product', label: 'Product / product code', required: true },
      { key: 'productRevision', label: 'Released product revision', required: true }, { key: 'quantity', label: 'Planned quantity', type: 'number', required: true }, { key: 'unit', label: 'Unit', options: ['Each', 'Metre', 'Kilogram', 'Batch'] },
      { key: 'bomReference', label: 'BOM reference', required: true }, { key: 'workCentre', label: 'Primary work centre', options: ['Assembly Cell A', 'Fibre Prep Bench', 'Optical Test Lab', 'Packaging Line'] },
      { key: 'startDate', label: 'Planned start', type: 'date' }, { key: 'finishDate', label: 'Planned finish', type: 'date' }, { key: 'priority', label: 'Priority', options: ['Low', 'Normal', 'High', 'Expedite'] },
      { key: 'materialStatus', label: 'Material readiness', options: ['Available', 'Shortage identified', 'Partially available', 'Awaiting inspection'] }, { key: 'capacityHours', label: 'Required capacity (hours)', type: 'number' },
      { key: 'plannedCost', label: 'Planned cost (USD)', type: 'number' }, { key: 'components', label: 'Component / material requirements', type: 'textarea', wide: true }, { key: 'instructions', label: 'Production instructions', type: 'textarea', wide: true }, { key: 'operationConfirmation', label: 'Operation / shop-floor confirmation', type: 'textarea', wide: true }, { key: 'goodQty', label: 'Good quantity reported', type: 'number' }, { key: 'scrapQty', label: 'Scrap quantity', type: 'number' }, { key: 'reworkQty', label: 'Rework quantity', type: 'number' },
    ],
    seeds: [
      rec('MO-2026-0148', 'Cabinet assembly · 24 units', 'Released', 44400, '24 units · material availability confirmed', { product: 'Outdoor Fibre Distribution Cabinet · PRD-10042', productRevision: 'C', quantity: '24', unit: 'Each', bomReference: 'BOM-C', workCentre: 'Assembly Cell A', startDate: today, finishDate: '2026-11-14', priority: 'High', materialStatus: 'Available', capacityHours: '72', plannedCost: '44400', components: 'Enclosure × 24\nSplice tray × 96\nCable management kit × 24', instructions: 'Complete assembly and route each unit to final optical and electrical inspection.' }),
      rec('MO-2026-0152', 'Access terminal pilot · 60 units', 'Pending Approval', 25200, 'Pilot batch · optical test capacity review pending', { product: 'Fibre Access Terminal 16-Port · PRD-10057', productRevision: 'B', quantity: '60', unit: 'Each', bomReference: 'BOM-B', workCentre: 'Optical Test Lab', startDate: '2026-11-12', finishDate: '2026-11-18', priority: 'Normal', materialStatus: 'Partially available', capacityHours: '48', plannedCost: '25200', components: 'Housing × 60\nAdapter panel × 60\nSC/APC adapter × 960', instructions: 'Pilot build. Record test result for every serialised unit.' }),
    ],
  },
  '/quality/management': {
    title: 'Quality Management', subtitle: 'Plan inspections, record acceptance decisions, control non-conformance and follow corrective and preventive actions through effectiveness review.', noun: 'Inspection / Quality Case', icon: ClipboardCheck, amountLabel: 'Affected quantity', amountKey: 'affectedQty', amountType: 'quantity',
    columns: [{ label: 'Quality record', key: 'reference' }, { label: 'Inspection / item', key: 'title' }, { label: 'Source / lot', key: 'sourceLot' }, { label: 'Inspector', key: 'inspector' }, { label: 'Result', key: 'result' }, { label: 'Status', key: 'status' }],
    fields: [
      { key: 'recordType', label: 'Record type', options: ['Incoming inspection', 'In-process inspection', 'Final inspection', 'Non-conformance', 'CAPA', 'Quality audit'] }, { key: 'item', label: 'Product / material', required: true },
      { key: 'sourceLot', label: 'Source document / lot / serial', required: true }, { key: 'inspectionPlan', label: 'Inspection plan / characteristic', required: true }, { key: 'inspector', label: 'Inspector / responsible owner', required: true },
      { key: 'sampleSize', label: 'Sample size', type: 'number' }, { key: 'affectedQty', label: 'Affected quantity', type: 'number' }, { key: 'result', label: 'Inspection result', options: ['Pending inspection', 'Accepted', 'Accepted with deviation', 'Rejected', 'Non-conformance raised'] },
      { key: 'severity', label: 'Severity', options: ['Minor', 'Major', 'Critical', 'Not applicable'] }, { key: 'disposition', label: 'Material disposition', options: ['Release', 'Rework', 'Return to supplier', 'Scrap', 'Quarantine'] },
      { key: 'dueDate', label: 'CAPA / response due date', type: 'date' }, { key: 'findings', label: 'Inspection findings / evidence', type: 'textarea', wide: true }, { key: 'rootCause', label: 'Root cause', type: 'textarea', wide: true },
      { key: 'correctiveAction', label: 'Corrective / preventive action', type: 'textarea', wide: true }, { key: 'verification', label: 'Effectiveness verification', type: 'textarea', wide: true }, { key: 'certificate', label: 'Certificate / traceability reference', type: 'textarea', wide: true },
    ],
    seeds: [
      rec('QIR-2026-0062', 'Incoming connector inspection', 'Accepted', 48, '48 sampled connectors accepted against dimensional and optical criteria', { recordType: 'Incoming inspection', item: 'SC/APC fibre connector', sourceLot: 'LOT-FC-22091 · PO-2026-0831', inspectionPlan: 'Ferrule end-face · insertion loss · dimensions', inspector: 'Quality Technician · J. Brown', sampleSize: '48', affectedQty: '0', result: 'Accepted', severity: 'Not applicable', disposition: 'Release', dueDate: '', findings: 'All sampled units within specified tolerance.', rootCause: '', correctiveAction: '', verification: '' }),
      rec('NCR-2026-0019', 'Enclosure coating thickness variance', 'Pending Approval', 12, '12 units quarantined pending disposition and corrective action review', { recordType: 'Non-conformance', item: 'Outdoor cabinet enclosure', sourceLot: 'LOT-ENC-0917 · MO-2026-0136', inspectionPlan: 'Coating thickness: 80–120 μm', inspector: 'Quality Engineer · A. Reid', sampleSize: '5', affectedQty: '12', result: 'Non-conformance raised', severity: 'Major', disposition: 'Quarantine', dueDate: '2026-11-12', findings: 'Two of five samples measured below minimum coating thickness.', rootCause: 'Pre-treatment dwell time under review.', correctiveAction: 'Segregate affected units; verify coating line settings and re-inspect.', verification: 'Pending re-inspection' }),
    ],
  },
  '/logistics/transportation': {
    title: 'Transportation & Logistics', subtitle: 'Plan freight, assign carriers, execute shipments, monitor route and delivery milestones, and capture freight settlement references.', noun: 'Shipment / Freight Plan', icon: Truck, amountLabel: 'Freight estimate', amountKey: 'freightCost',
    columns: [{ label: 'Shipment', key: 'reference' }, { label: 'Order / delivery', key: 'sourceOrder' }, { label: 'Carrier', key: 'carrier' }, { label: 'Route', key: 'route' }, { label: 'ETA', key: 'eta' }, { label: 'Status', key: 'status' }],
    fields: [
      { key: 'sourceOrder', label: 'Sales order / delivery reference', required: true }, { key: 'carrier', label: 'Carrier / transport provider', required: true }, { key: 'mode', label: 'Transport mode', options: ['Road', 'Air', 'Ocean', 'Courier', 'Inter-warehouse transfer'] },
      { key: 'origin', label: 'Origin', required: true }, { key: 'destination', label: 'Destination', required: true }, { key: 'route', label: 'Planned route', required: true }, { key: 'dispatchDate', label: 'Planned dispatch date', type: 'date' },
      { key: 'eta', label: 'Estimated arrival date', type: 'date' }, { key: 'tracking', label: 'Tracking / consignment reference' }, { key: 'vehicle', label: 'Vehicle / container reference' }, { key: 'freightCost', label: 'Freight estimate (USD)', type: 'number' },
      { key: 'settlement', label: 'Freight settlement status', options: ['Not submitted', 'Pending verification', 'Approved for settlement', 'Settled'] }, { key: 'milestones', label: 'Shipment milestones / actual timestamps', type: 'textarea', wide: true }, { key: 'specialHandling', label: 'Special handling requirements', type: 'textarea', wide: true }, { key: 'deliveryEvidence', label: 'Delivery / exception notes', type: 'textarea', wide: true },
    ],
    seeds: [
      rec('SHP-2026-0218', 'Spalding network equipment delivery', 'In Transit', 685, 'Road freight · estimated arrival 09 Nov 2026', { sourceOrder: 'SO-2026-2051 · DLV-2026-0192', carrier: 'Island Freight & Haulage', mode: 'Road', origin: 'Kingston Distribution Centre', destination: 'Spalding Depot, Clarendon', route: 'Kingston → May Pen → Spalding', dispatchDate: '2026-11-06', eta: '2026-11-09', tracking: 'IFH-88421', vehicle: 'Truck JM-4821', freightCost: '685', settlement: 'Pending verification', specialHandling: 'Keep optical equipment dry and secured.', deliveryEvidence: 'Departure scan recorded; arrival confirmation pending.' }),
      rec('SHP-2026-0224', 'Customer cabinet delivery', 'Scheduled', 420, 'Carrier assigned; dispatch scheduled', { sourceOrder: 'SO-2026-2074 · DLV-2026-0203', carrier: 'Caribbean Parcel Logistics', mode: 'Road', origin: 'Montego Bay Warehouse', destination: 'Mandeville Customer Site', route: 'Montego Bay → Mandeville', dispatchDate: '2026-11-10', eta: '2026-11-10', tracking: 'CPL-55192', vehicle: 'Van JM-1937', freightCost: '420', settlement: 'Not submitted', specialHandling: 'Customer site access appointment required.', deliveryEvidence: '' }),
    ],
  },
  '/service/field-service': {
    title: 'Service & Field Service', subtitle: 'Manage service requests, entitlement checks, SLA response, technician scheduling, dispatch, mobile execution and customer debrief.', noun: 'Service Order', icon: LifeBuoy, amountLabel: 'Estimated service cost', amountKey: 'estimatedCost',
    columns: [{ label: 'Service order', key: 'reference' }, { label: 'Customer / asset', key: 'customer' }, { label: 'Issue / priority', key: 'issue' }, { label: 'Technician', key: 'technician' }, { label: 'Appointment', key: 'appointment' }, { label: 'Status', key: 'status' }],
    fields: [
      { key: 'customer', label: 'Customer / site', required: true }, { key: 'asset', label: 'Asset / installed base reference', required: true }, { key: 'requestChannel', label: 'Request channel', options: ['Customer portal', 'Phone', 'Email', 'Internal case', 'Preventive visit'] },
      { key: 'issue', label: 'Reported issue / service scope', required: true, type: 'textarea', wide: true }, { key: 'priority', label: 'Priority', options: ['Low', 'Normal', 'High', 'Emergency'] }, { key: 'entitlement', label: 'Warranty / entitlement', options: ['In warranty', 'Covered contract', 'Chargeable', 'Pending verification'] },
      { key: 'sla', label: 'Response / resolution target', options: ['4-hour response', 'Same business day', 'Next business day', 'Contract-specific'] }, { key: 'requiredSkill', label: 'Required skill / certification', required: true }, { key: 'technician', label: 'Assigned technician / contractor', required: true },
      { key: 'appointment', label: 'Scheduled appointment', type: 'date' }, { key: 'parts', label: 'Parts / van stock requirement', type: 'textarea', wide: true }, { key: 'estimatedHours', label: 'Estimated labour hours', type: 'number' },
      { key: 'estimatedCost', label: 'Estimated service cost (USD)', type: 'number' }, { key: 'checklist', label: 'Field checklist / safety notes', type: 'textarea', wide: true }, { key: 'debrief', label: 'Technician debrief / resolution', type: 'textarea', wide: true },
      { key: 'customerRating', label: 'Customer satisfaction', options: ['Not captured', 'Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'] }, { key: 'checkIn', label: 'Technician check-in / site arrival note', type: 'textarea', wide: true }, { key: 'offlineSync', label: 'Offline work pack / sync status', options: ['Not applicable', 'Prepared', 'Pending sync', 'Synced in demo'] },
    ],
    seeds: [
      rec('FSO-2026-0312', 'No service · access network check', 'Scheduled', 145, 'Customer site visit · entitlement verification required', { customer: 'Donald Simpson · Spalding', asset: 'ONT-CL-0187 · Customer installed base', requestChannel: 'Phone', issue: 'Customer reports no internet service. Verify optical power, ONT status and drop cable condition.', priority: 'High', entitlement: 'Pending verification', sla: 'Same business day', requiredSkill: 'Fibre access troubleshooting', technician: 'Carlmin Stewart', appointment: '2026-11-08', parts: 'SC/APC patch lead × 1\nDrop cable repair kit × 1', estimatedHours: '2', estimatedCost: '145', checklist: 'Confirm customer identity and site access. Follow electrical and ladder safety checks.', debrief: '', customerRating: 'Not captured' }),
      rec('FSO-2026-0318', 'Preventive inspection · cabinet', 'Pending Approval', 90, 'Scheduled maintenance request for network cabinet', { customer: 'Spalding Depot', asset: 'CAB-SP-0071 · Outdoor cabinet', requestChannel: 'Preventive visit', issue: 'Inspect seals, grounding, temperature and fibre management.', priority: 'Normal', entitlement: 'Covered contract', sla: 'Next business day', requiredSkill: 'Fibre plant inspection', technician: 'Field Operations Team', appointment: '2026-11-11', parts: 'Replacement gasket if required', estimatedHours: '1.5', estimatedCost: '90', checklist: 'Site risk assessment and access permit required.', debrief: '', customerRating: 'Not captured' }),
    ],
  },
  '/people/hcm': {
    title: 'Human Capital Management', subtitle: 'Maintain worker records, organisational assignment and lifecycle events, with controlled updates to time, qualifications and workforce status.', noun: 'Worker Record', icon: Users, amountLabel: 'Annual compensation reference', amountKey: 'annualCompensation',
    columns: [{ label: 'Worker', key: 'title' }, { label: 'Worker ID', key: 'workerId' }, { label: 'Position / department', key: 'position' }, { label: 'Manager', key: 'manager' }, { label: 'Location', key: 'location' }, { label: 'Status', key: 'status' }],
    fields: [
      { key: 'workerId', label: 'Worker ID', required: true }, { key: 'name', label: 'Worker full name', required: true }, { key: 'employmentType', label: 'Employment type', options: ['Full-time', 'Part-time', 'Fixed-term', 'Contractor', 'Temporary'] },
      { key: 'position', label: 'Position / job title', required: true }, { key: 'department', label: 'Department / organisation unit', required: true }, { key: 'manager', label: 'Line manager' }, { key: 'location', label: 'Work location / site', required: true },
      { key: 'startDate', label: 'Effective start date', type: 'date' }, { key: 'workerStatus', label: 'Worker lifecycle status', options: ['Pre-hire', 'Active', 'On leave', 'Transferred', 'Notice period', 'Exited'] }, { key: 'workEmail', label: 'Work email', type: 'email' },
      { key: 'timePattern', label: 'Work pattern / shift', options: ['Standard', 'Day shift', 'Evening shift', 'Night shift', 'Rotating'] }, { key: 'payGroup', label: 'Payroll group' }, { key: 'annualCompensation', label: 'Annual compensation reference (USD)', type: 'number' },
      { key: 'qualifications', label: 'Qualifications / certifications', type: 'textarea', wide: true }, { key: 'certificationExpiry', label: 'Next certification expiry', type: 'date' }, { key: 'timesheetPeriod', label: 'Timesheet / attendance period' }, { key: 'regularHours', label: 'Regular hours', type: 'number' }, { key: 'overtimeHours', label: 'Overtime hours', type: 'number' }, { key: 'leaveType', label: 'Leave / absence type', options: ['Not applicable', 'Annual', 'Sick', 'Family', 'Unpaid'] }, { key: 'recruitmentRef', label: 'Recruitment / onboarding reference' }, { key: 'lifecycleReason', label: 'Lifecycle change reason / notes', type: 'textarea', wide: true },
    ],
    seeds: [
      rec('WRK-00418', 'Jordan Brown', 'Active', 52000, 'Full-time · Network Operations Supervisor', { workerId: 'WRK-00418', name: 'Jordan Brown', employmentType: 'Full-time', position: 'Network Operations Supervisor', department: 'Network Operations', manager: 'Operations Director', location: 'Kingston', startDate: '2024-03-18', workerStatus: 'Active', workEmail: 'jordan.brown@example.test', timePattern: 'Standard', payGroup: 'JAM-SALARIED', annualCompensation: '52000', qualifications: 'Fibre Optic Technician Level 2 · Expires 2027-08-31', lifecycleReason: 'Current worker record' }),
      rec('WRK-00427', 'Amelia Reid', 'Pending Approval', 38500, 'Fixed-term · Quality Technician', { workerId: 'WRK-00427', name: 'Amelia Reid', employmentType: 'Fixed-term', position: 'Quality Technician', department: 'Quality & Compliance', manager: 'Jordan Brown', location: 'Spalding Depot', startDate: '2026-11-10', workerStatus: 'Pre-hire', workEmail: 'amelia.reid@example.test', timePattern: 'Day shift', payGroup: 'JAM-HOURLY', annualCompensation: '38500', qualifications: 'Inspection and test certification · Verification pending', lifecycleReason: 'New starter onboarding record submitted' }),
    ],
  },
  '/ehs/management': {
    title: 'Environment, Health & Safety', subtitle: 'Record safety incidents, risk assessments, inspections and environmental actions with ownership, due dates, evidence and review controls.', noun: 'EHS Record', icon: HardHat, amountLabel: 'People / assets affected', amountKey: 'affectedCount', amountType: 'quantity',
    columns: [{ label: 'EHS record', key: 'reference' }, { label: 'Incident / hazard', key: 'title' }, { label: 'Site', key: 'site' }, { label: 'Risk rating', key: 'risk' }, { label: 'Owner', key: 'owner' }, { label: 'Status', key: 'status' }],
    fields: [
      { key: 'recordType', label: 'Record type', options: ['Incident', 'Near miss', 'Risk assessment', 'Safety inspection', 'Environmental observation', 'Permit review'] }, { key: 'hazard', label: 'Incident / hazard / activity', required: true }, { key: 'site', label: 'Site / work location', required: true },
      { key: 'eventDate', label: 'Event / assessment date', type: 'date' }, { key: 'reportedBy', label: 'Reported by', required: true }, { key: 'owner', label: 'Responsible owner', required: true }, { key: 'risk', label: 'Risk rating', options: ['Low', 'Moderate', 'High', 'Critical'] },
      { key: 'severity', label: 'Severity / potential consequence', options: ['First aid', 'Medical treatment', 'Lost time', 'Property damage', 'Environmental impact', 'Near miss'] }, { key: 'affectedCount', label: 'People / assets affected', type: 'number' }, { key: 'dueDate', label: 'Corrective action due date', type: 'date' },
      { key: 'immediateControls', label: 'Immediate controls / containment', type: 'textarea', wide: true }, { key: 'rootCause', label: 'Root cause / contributing factors', type: 'textarea', wide: true }, { key: 'correctiveAction', label: 'Corrective and preventive action', type: 'textarea', wide: true },
      { key: 'evidence', label: 'Evidence / investigation notes', type: 'textarea', wide: true }, { key: 'environmentalAspect', label: 'Environmental aspect / disclosure note', type: 'textarea', wide: true },
    ],
    seeds: [
      rec('EHS-2026-0087', 'Near miss · ladder access', 'Investigating', 1, 'Near miss during elevated access; work paused and access controls reviewed', { recordType: 'Near miss', hazard: 'Unsecured ladder at elevated fibre cabinet access', site: 'Spalding Network Site', eventDate: '2026-11-06', reportedBy: 'Field Technician', owner: 'EHS Coordinator', risk: 'High', severity: 'Near miss', affectedCount: '1', dueDate: '2026-11-09', immediateControls: 'Work stopped. Ladder removed from service pending inspection.', rootCause: 'Securing method and pre-use inspection to be confirmed.', correctiveAction: 'Re-brief technicians on ladder inspection and site setup. Record toolbox talk attendance.', evidence: 'Supervisor notification logged; investigation evidence pending.', environmentalAspect: 'No environmental release reported.' }),
      rec('EHS-2026-0091', 'Depot fire equipment inspection', 'Pending Approval', 0, 'Monthly inspection submitted for responsible review', { recordType: 'Safety inspection', hazard: 'Fire extinguisher and emergency egress checks', site: 'Spalding Depot', eventDate: today, reportedBy: 'Facilities Officer', owner: 'EHS Coordinator', risk: 'Moderate', severity: 'Property damage', affectedCount: '0', dueDate: '2026-11-12', immediateControls: 'Exit routes clear at time of inspection.', rootCause: '', correctiveAction: 'Replace one extinguisher inspection tag and re-verify access signage.', evidence: 'Inspection checklist completed.', environmentalAspect: '' }),
    ],
  },
};

const statuses = ['All statuses', 'Draft', 'Pending Approval', 'Approved', 'Released', 'Scheduled', 'Dispatched', 'In Transit', 'In Progress', 'Investigating', 'On hold', 'Accepted', 'Rejected', 'Completed', 'Closed', 'Active', 'Cancelled'];
const prefix: Record<string, string> = { '/manufacturing/product-engineering': 'PRD', '/manufacturing/production-planning': 'MO-2026', '/quality/management': 'QIR-2026', '/logistics/transportation': 'SHP-2026', '/service/field-service': 'FSO-2026', '/people/hcm': 'WRK', '/ehs/management': 'EHS-2026' };
const nextStatus = (path: string, state: string): string | null => {
  if (state === 'Pending Approval') return 'Approved';
  if (path === '/manufacturing/product-engineering' && state === 'Approved') return 'Released';
  if (path === '/manufacturing/production-planning') return ({ Approved: 'Released', Released: 'In Progress', 'In Progress': 'Completed' } as Record<string, string>)[state] || null;
  if (path === '/quality/management') return ({ Approved: 'Accepted', Accepted: 'Closed', Investigating: 'Completed' } as Record<string, string>)[state] || null;
  if (path === '/logistics/transportation') return ({ Approved: 'Scheduled', Scheduled: 'Dispatched', Dispatched: 'In Transit', 'In Transit': 'Completed' } as Record<string, string>)[state] || null;
  if (path === '/service/field-service') return ({ Approved: 'Scheduled', Scheduled: 'Dispatched', Dispatched: 'In Progress', 'In Progress': 'Completed' } as Record<string, string>)[state] || null;
  if (path === '/people/hcm') return ({ Approved: 'Active' } as Record<string, string>)[state] || null;
  if (path === '/ehs/management') return ({ Approved: 'Investigating', Investigating: 'Completed', Completed: 'Closed' } as Record<string, string>)[state] || null;
  return state === 'Draft' ? 'Pending Approval' : null;
};

function displayAmount(config: Config, value: number): string {
  return config.amountType === 'quantity' ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value) : formatCurrency(value);
}

function displayValue(item: RecordItem, key: string): string {
  if (key === 'reference') return item.reference;
  if (key === 'title') return item.title;
  if (key === 'status') return item.status;
  if (key === 'amount') return formatCurrency(item.amount);
  return item.fields[key] || '—';
}

export function Phase5Workspace({ pathname }: { pathname: string }) {
  const config = configs[pathname];
  const storageKey = `radium-phase5:${pathname}`;
  const [records, setRecords] = useState<RecordItem[]>(() => {
    try { const saved = localStorage.getItem(storageKey); return saved ? JSON.parse(saved) as RecordItem[] : config.seeds; }
    catch { return config.seeds; }
  });
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All statuses');
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<RecordItem | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [toast, setToast] = useState('');
  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(records)); }, [records, storageKey]);

  const filtered = useMemo(() => records.filter((item) => {
    const matchStatus = status === 'All statuses' || item.status === status;
    const text = [item.reference, item.title, item.description, ...Object.values(item.fields)].join(' ').toLowerCase();
    return matchStatus && text.includes(query.toLowerCase());
  }), [records, query, status]);
  const pending = records.filter((item) => item.status === 'Pending Approval').length;
  const active = records.filter((item) => ['Active', 'Released', 'Scheduled', 'Dispatched', 'In Transit', 'In Progress', 'Investigating'].includes(item.status)).length;
  const total = records.reduce((sum, item) => sum + item.amount, 0);
  const Icon = config.icon;

  const openNew = () => { setEditingId(null); setForm({ eventDate: today, startDate: today, dispatchDate: today }); setFormOpen(true); };
  const openEdit = (item: RecordItem) => { setEditingId(item.id); setForm({ ...item.fields }); setSelected(null); setFormOpen(true); };
  const save = (submit: boolean) => {
    const missing = config.fields.find((field) => field.required && !form[field.key]?.trim());
    if (missing) { setToast(`${missing.label} is required.`); return; }
    const old = records.find((item) => item.id === editingId);
    const reference = old?.reference || `${prefix[pathname]}-${String(Date.now()).slice(-5)}`;
    const value = Number(form[config.amountKey] || 0);
    const title = form.name || form.product || form.item || form.hazard || form.issue || form.workerId || form.sourceOrder || form.customer || config.noun;
    const description = form.issue || form.findings || form.changeReason || form.instructions || form.correctiveAction || `${config.noun} record`;
    const updated: RecordItem = { id: old?.id || reference, reference, title, date: form.eventDate || form.startDate || form.dispatchDate || today, status: submit ? 'Pending Approval' : (old?.status || 'Draft'), amount: Number.isFinite(value) ? value : 0, description, fields: { ...form }, history: [...(old?.history || []), ...hist(old ? 'Updated record' : submit ? 'Submitted for approval' : 'Saved draft')] };
    setRecords((previous) => old ? previous.map((item) => item.id === old.id ? updated : item) : [updated, ...previous]);
    setFormOpen(false); setEditingId(null); setToast(submit ? `${config.noun} submitted for review.` : `${config.noun} saved as draft.`);
  };
  const transition = (item: RecordItem, to: string) => {
    const updated = { ...item, status: to, history: [...item.history, ...hist(`Status changed to ${to}`)] };
    setRecords((previous) => previous.map((record) => record.id === item.id ? updated : record)); setSelected(updated); setToast(`${item.reference} moved to ${to}.`);
  };

  return <div className="page-stack phase4-workspace phase5-workspace">
    <SectionHeading eyebrow="PHASE 5 · MANUFACTURING, PEOPLE & OPERATIONS" title={config.title} subtitle={config.subtitle} action={<span className="phase-chip">Demo environment · Local persistence</span>} />
    <div className="demo-banner"><div className="demo-banner-icon"><ShieldCheck size={17} /></div><div><strong>Interactive prototype · simulated processing</strong><span>Records, reviews and workflow states are saved in this browser. No live production release, inventory consumption, freight booking, payroll, field dispatch or statutory filing is executed.</span></div><span className="demo-pill">DEMO</span></div>
    <div className="finance-metric-grid phase4-metrics">
      <div className="panel finance-metric"><span>Total records</span><strong>{records.length}</strong><small>In this workspace</small></div>
      <div className="panel finance-metric"><span>Pending review</span><strong>{pending}</strong><small>Awaiting simulated approval</small></div>
      <div className="panel finance-metric"><span>Active workflow</span><strong>{active}</strong><small>Open or released records</small></div>
      <div className="panel finance-metric"><span>{config.amountLabel}</span><strong>{displayAmount(config, total)}</strong><small>{config.amountType === 'quantity' ? 'Illustrative count' : 'Illustrative total · USD'}</small></div>
    </div>
    <section className="panel transactions-panel">
      <div className="panel-heading phase4-heading"><div><h2><Icon size={18} /> {config.title} register</h2><p>Search records, open details and activity, or create a new transaction.</p></div><button className="btn btn-primary" onClick={openNew}><Plus size={15} /> New {config.noun}</button></div>
      <div className="finance-toolbar"><label className="finance-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${config.title.toLowerCase()}...`} /></label><select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status">{statuses.map((s) => <option key={s}>{s}</option>)}</select></div>
      <div className="table-wrap"><table className="data-table"><thead><tr>{config.columns.map((column) => <th key={column.key}>{column.label.toUpperCase()}</th>)}<th>DETAIL</th></tr></thead><tbody>
        {filtered.map((item) => <tr key={item.id} className="clickable-row" onClick={() => setSelected(item)}>{config.columns.map((column) => <td key={column.key}>{column.key === 'status' ? <StatusBadge status={item.status} /> : column.key === 'amount' ? <strong>{displayAmount(config, item.amount)}</strong> : column.key === 'reference' ? <strong>{item.reference}</strong> : column.key === 'title' ? <><strong>{item.title}</strong><small className="finance-subline">{item.description}</small></> : <span>{displayValue(item, column.key)}</span>}</td>)}<td><button className="icon-action" aria-label={`View ${item.reference}`} onClick={(event) => { event.stopPropagation(); setSelected(item); }}><ArrowRight size={15} /></button></td></tr>)}
      </tbody></table>{filtered.length === 0 && <div className="finance-empty"><Search size={22} /><strong>No matching records</strong><span>Change the search text or status filter.</span></div>}</div>
      <div className="table-bottom"><span>{filtered.length} of {records.length} records shown</span><span>Local demo register · changes persist in this browser</span></div>
    </section>
    <div className="finance-control-note"><Activity size={17} /><span><strong>Connected workflows:</strong> Product revisions govern BOM and production use; production orders consume planned materials and trigger quality checks; quality dispositions control release; logistics executes shipment plans; field service links customer, asset, technician and entitlement; HCM qualifications inform scheduling; EHS records safety and environmental follow-up.</span></div>

    {formOpen && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setFormOpen(false)}><div className="finance-modal phase4-modal" role="dialog" aria-modal="true" aria-label={`${editingId ? 'Edit' : 'Create'} ${config.noun}`}>
      <div className="finance-modal-header"><div><span className="eyebrow">{editingId ? 'EDIT RECORD' : 'NEW OPERATIONAL RECORD'}</span><h2>{editingId ? 'Edit' : 'Create'} {config.noun}</h2><p>Complete the relevant business fields. Required fields are marked.</p></div><button className="close-button" onClick={() => setFormOpen(false)} aria-label="Close form"><X size={18} /></button></div>
      <div className="finance-form-body"><div className="finance-form-grid">{config.fields.map((field) => <label key={field.key} className={field.wide ? 'wide' : ''}>{field.label}{field.required ? ' *' : ''}{field.options ? <select value={form[field.key] || ''} onChange={(event) => setForm((previous) => ({ ...previous, [field.key]: event.target.value }))}><option value="">Select...</option>{field.options.map((option) => <option key={option}>{option}</option>)}</select> : field.type === 'textarea' ? <textarea rows={3} value={form[field.key] || ''} onChange={(event) => setForm((previous) => ({ ...previous, [field.key]: event.target.value }))} /> : <input type={field.type || 'text'} min={field.type === 'number' ? 0 : undefined} step={field.type === 'number' ? 'any' : undefined} value={form[field.key] || ''} onChange={(event) => setForm((previous) => ({ ...previous, [field.key]: event.target.value }))} />}</label>)}</div></div>
      <div className="finance-modal-footer"><button className="btn btn-secondary" onClick={() => setFormOpen(false)}>Cancel</button><button className="btn btn-secondary" onClick={() => save(false)}>Save draft</button><button className="btn btn-primary" onClick={() => save(true)}><Send size={15} /> Submit for review</button></div>
    </div></div>}

    {selected && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}><div className="finance-modal detail-finance-modal" role="dialog" aria-modal="true" aria-label="Record details">
      <div className="finance-modal-header"><div><span className="eyebrow">{config.noun.toUpperCase()} · {selected.reference}</span><h2>{selected.title}</h2><p>{selected.description}</p></div><button className="close-button" onClick={() => setSelected(null)} aria-label="Close details"><X size={18} /></button></div>
      <div className="finance-detail-body"><div className="finance-detail-amount"><span>{config.amountLabel}</span><strong>{displayAmount(config, selected.amount)}</strong><StatusBadge status={selected.status} /></div><div className="finance-detail-grid">{Object.entries(selected.fields).filter(([, value]) => value).map(([key, value]) => <div key={key}><span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase())}</span><strong>{value}</strong></div>)}<div><span>Record date</span><strong>{formatDate(selected.date)}</strong></div><div><span>Reference</span><strong>{selected.reference}</strong></div></div>
        <div className="finance-history"><strong>Activity history</strong>{selected.history.map((entry, index) => <div className="finance-history-row" key={`${entry.action}-${index}`}><span className="history-dot" /><div><strong>{entry.action}</strong><small>{entry.by} · {entry.at}</small></div></div>)}</div>
        <div className="finance-validation-note"><ShieldCheck size={16} /><span>This is a simulated operational record. Production, inventory, payroll, dispatch and compliance transactions are not sent to external systems.</span></div>
      </div>
      <div className="finance-modal-footer"><button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>{selected.status === 'Draft' && <button className="btn btn-secondary" onClick={() => openEdit(selected)}>Edit draft</button>}{selected.status === 'Pending Approval' && <button className="btn btn-secondary" onClick={() => transition(selected, 'Rejected')}>Reject</button>}{nextStatus(pathname, selected.status) && <button className="btn btn-primary" onClick={() => transition(selected, nextStatus(pathname, selected.status) || selected.status)}>{selected.status === 'Pending Approval' ? <BadgeCheck size={15} /> : <Check size={15} />}{selected.status === 'Pending Approval' ? 'Approve' : `Advance to ${nextStatus(pathname, selected.status)}`}</button>}</div>
    </div></div>}
    {toast && <div className="toast-message"><Check size={16} />{toast}<button onClick={() => setToast('')} aria-label="Dismiss"><X size={14} /></button></div>}
  </div>;
}
