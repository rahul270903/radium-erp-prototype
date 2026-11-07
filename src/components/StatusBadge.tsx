import type { TransactionStatus } from '../data/mockData';

type Props = { status: TransactionStatus | string };

const tone: Record<string, string> = {
  Approved: 'status-green',
  Released: 'status-green',
  Accepted: 'status-green',
  Active: 'status-green',
  Closed: 'status-green',
  Posted: 'status-green',
  Paid: 'status-green',
  'Pending approval': 'status-amber',
  'Pending Approval': 'status-amber',
  Rejected: 'status-red',
  Draft: 'status-gray',
  'In progress': 'status-blue',
  'In Progress': 'status-blue',
  Scheduled: 'status-blue',
  Dispatched: 'status-blue',
  'In Transit': 'status-blue',
  Investigating: 'status-blue',
  'Partially paid': 'status-violet',
  'Partially Received': 'status-violet',
  'Inspection Hold': 'status-amber',
  Open: 'status-blue',
  Received: 'status-green',
  Completed: 'status-green',
  Qualified: 'status-green',
  'Pending Review': 'status-amber',
  Connected: 'status-green',
  Simulated: 'status-amber',
  'Action required': 'status-amber',
};

export function StatusBadge({ status }: Props) {
  return <span className={`status-badge ${tone[status] ?? 'status-gray'}`}><span className="status-dot" />{status}</span>;
}
