import type { ComponentProps } from 'react';
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BellRing, Briefcase, CalendarDays,
  CheckCircle2, ChevronDown, CircleAlert, Clock3, FileCheck2, FileText, Layers3, PackageCheck,
  RefreshCw, ShieldCheck, ShoppingCart, Wallet, Wrench,
} from 'lucide-react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts';
import { approvals, cashFlow, monthlyPerformance, operationalPulse, transactions } from '../../data/mockData';
import { formatCurrency, formatDate, todayLabel } from '../../lib/format';
import { StatusBadge } from '../../components/StatusBadge';
import { SectionHeading } from '../../components/SectionHeading';

const kpis = [
  { label: 'Total revenue', value: '$2.48M', change: '+8.2%', direction: 'up', note: 'vs previous period', icon: Wallet, color: 'blue', detail: 'Recognised and operational revenue' },
  { label: 'Total expenses', value: '$1.12M', change: '+3.1%', direction: 'down', note: 'vs previous period', icon: ReceiptIcon, color: 'slate', detail: 'Operating and business expenses' },
  { label: 'Accounts receivable', value: '$428.6K', change: '−4.6%', direction: 'down', note: 'vs previous period', icon: FileCheck2, color: 'teal', detail: 'Outstanding customer balances' },
  { label: 'Accounts payable', value: '$286.3K', change: '+2.4%', direction: 'up', note: 'vs previous period', icon: ShoppingCart, color: 'violet', detail: 'Open supplier obligations' },
];

function ReceiptIcon(props: ComponentProps<typeof Wallet>) { return <Layers3 {...props} />; }

const chartTooltipStyle = { border: '1px solid #e6eaf0', borderRadius: 10, fontSize: 12, boxShadow: '0 8px 24px rgba(18,32,56,.08)' };

export function Dashboard() {
  return (
    <div className="page-stack">
      <SectionHeading
        eyebrow="OVERVIEW / ENTERPRISE WORKSPACE"
        title="Good morning"
        subtitle={`${todayLabel()} · Here's what's happening across your business.`}
        action={<button className="btn btn-secondary" onClick={() => window.dispatchEvent(new Event('radium:refresh'))}><RefreshCw size={15} /> Refresh data</button>}
      />

      <div className="demo-banner">
        <div className="demo-banner-icon"><CircleAlert size={17} /></div>
        <div><strong>Demonstration workspace</strong><span>All figures, transactions and operational updates on this screen are illustrative demo data. No live ERP or accounting system is connected.</span></div>
        <span className="demo-pill">DEMO DATA</span>
      </div>

      <div className="kpi-grid">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <article className="kpi-card" key={kpi.label}>
              <div className="kpi-card-top"><span>{kpi.label}</span><span className={`kpi-icon ${kpi.color}`}><Icon size={18} /></span></div>
              <div className="kpi-value">{kpi.value}</div>
              <div className="kpi-foot"><span className={`kpi-change ${kpi.direction}`}>{kpi.direction === 'up' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{kpi.change}</span><span>{kpi.note}</span></div>
              <div className="kpi-detail">{kpi.detail}</div>
            </article>
          );
        })}
      </div>

      <div className="secondary-kpi-grid">
        <article className="mini-stat"><div className="mini-stat-icon navy"><Wallet size={17} /></div><div><span>Cash position</span><strong>$1.84M</strong><small>Available cash · demo</small></div><span className="mini-stat-trend positive">+5.8%</span></article>
        <article className="mini-stat"><div className="mini-stat-icon blue"><ShoppingCart size={17} /></div><div><span>Open purchase orders</span><strong>42</strong><small>11 awaiting receipt</small></div><span className="mini-stat-link">View</span></article>
        <article className="mini-stat"><div className="mini-stat-icon amber"><Clock3 size={17} /></div><div><span>Pending approvals</span><strong>18</strong><small>Across 6 business areas</small></div><span className="mini-stat-alert">Needs review</span></article>
        <article className="mini-stat"><div className="mini-stat-icon teal"><PackageCheck size={17} /></div><div><span>Inventory valuation</span><strong>$3.62M</strong><small>Across 8 locations</small></div><span className="mini-stat-trend positive">+2.6%</span></article>
      </div>

      <div className="dashboard-grid charts-row">
        <section className="panel chart-panel">
          <div className="panel-heading">
            <div><h2>Financial performance</h2><p>Revenue and expenses · monthly comparison</p></div>
            <button className="select-like"><CalendarDays size={14} /> Last 6 months <ChevronDown size={14} /></button>
          </div>
          <div className="chart-legend"><span><i className="legend-dot revenue" /> Revenue</span><span><i className="legend-dot expenses" /> Expenses</span><span className="chart-unit">USD · thousands</span></div>
          <div className="chart-area performance-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPerformance} barGap={5} margin={{ top: 8, right: 6, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#eef1f5" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8993a3', fontSize: 11 }} dy={9} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8993a3', fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [`$${value}k`, '']} />
                <Bar dataKey="revenue" fill="#2868d8" radius={[4, 4, 0, 0]} maxBarSize={22} />
                <Bar dataKey="expenses" fill="#b8c8df" radius={[4, 4, 0, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-summary"><div><span>Revenue this period</span><strong>$418K</strong></div><div><span>Expenses this period</span><strong>$237K</strong></div><div><span>Operating margin</span><strong>43.3%</strong></div></div>
        </section>

        <section className="panel chart-panel cash-panel">
          <div className="panel-heading">
            <div><h2>Cash flow overview</h2><p>Inflow and outflow trend · monthly</p></div>
            <button className="icon-button subtle" title="More options"><span className="more-dots">•••</span></button>
          </div>
          <div className="cash-total"><strong>$159K</strong><span className="kpi-change up"><ArrowUpRight size={13} /> 6.4%</span><small>Net cash flow · November</small></div>
          <div className="chart-area cash-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlow} margin={{ top: 10, right: 5, left: -18, bottom: 0 }}>
                <defs><linearGradient id="inflowFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2c78df" stopOpacity={0.18} /><stop offset="95%" stopColor="#2c78df" stopOpacity={0.01} /></linearGradient></defs>
                <CartesianGrid stroke="#eef1f5" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8993a3', fontSize: 11 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8993a3', fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [`$${value}k`, '']} />
                <Area type="monotone" dataKey="inflow" stroke="#2868d8" fill="url(#inflowFill)" strokeWidth={2.3} />
                <Area type="monotone" dataKey="outflow" stroke="#aab6c6" fill="transparent" strokeWidth={2} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="cash-legend"><span><i className="legend-dot revenue" /> Cash inflow</span><span><i className="legend-dot expenses" /> Cash outflow</span><span className="chart-unit">USD · thousands</span></div>
        </section>
      </div>

      <div className="dashboard-grid work-row">
        <section className="panel approvals-panel">
          <div className="panel-heading">
            <div><div className="heading-with-count"><h2>My work queue</h2><span className="count-pill">18</span></div><p>Approvals, tasks and exceptions requiring attention</p></div>
            <button className="text-link" onClick={() => window.dispatchEvent(new Event('radium:open-inbox'))}>View inbox <ArrowRight size={14} /></button>
          </div>
          <div className="queue-list">
            {approvals.map((item) => (
              <div className="queue-item" key={item.id}>
                <div className={`queue-icon ${item.priority === 'High' ? 'high' : 'normal'}`}>{item.kind === 'Approval' ? <FileCheck2 size={17} /> : <BellRing size={17} />}</div>
                <div className="queue-main"><div className="queue-title-line"><strong>{item.title}</strong><span className={`priority ${item.priority.toLowerCase()}`}>{item.priority}</span></div><p>{item.detail}</p><small>{item.id} · {item.age}</small></div>
                <div className="queue-right"><strong>{item.amount.startsWith('$') ? item.amount : item.amount}</strong><button className="queue-open" onClick={() => window.dispatchEvent(new Event('radium:open-inbox'))} aria-label={`Open ${item.id}`}><ArrowRight size={15} /></button></div>
              </div>
            ))}
          </div>
          <div className="panel-footer"><span><CheckCircle2 size={14} /> Your queue is up to date</span><span>3 priority items shown</span></div>
        </section>

        <section className="panel pulse-panel">
          <div className="panel-heading"><div><h2>Operational pulse</h2><p>Live-style snapshot of key activity</p></div><span className="pulse-indicator"><i /> DEMO</span></div>
          <div className="pulse-grid">
            {operationalPulse.map((item) => {
              const Icon = item.icon === 'shopping-cart' ? ShoppingCart : item.icon === 'package-check' ? PackageCheck : item.icon === 'wrench' ? Wrench : Briefcase;
              return <div className="pulse-card" key={item.label}><div className={`pulse-icon ${item.color}`}><Icon size={17} /></div><strong>{item.count}</strong><span>{item.label}</span><small>{item.meta}</small></div>;
            })}
          </div>
          <div className="pulse-note"><div className="pulse-note-icon"><ActivityIcon /></div><div><strong>Operations running normally</strong><span>2 items are flagged for review across inventory and supplier invoicing.</span></div></div>
        </section>
      </div>

      <section className="panel transactions-panel">
        <div className="panel-heading">
          <div><h2>Recent transactions</h2><p>Latest activity across finance, procurement and operations</p></div>
          <button className="text-link" onClick={() => window.dispatchEvent(new Event('radium:open-search'))}>Search records <ArrowRight size={14} /></button>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>REFERENCE</th><th>TRANSACTION</th><th>COUNTERPARTY</th><th>DATE</th><th>AMOUNT</th><th>STATUS</th><th><span className="sr-only">Open</span></th></tr></thead>
            <tbody>
              {transactions.slice(0, 6).map((transaction) => (
                <tr key={transaction.id}>
                  <td><button className="reference-link" onClick={() => window.dispatchEvent(new CustomEvent('radium:show-transaction', { detail: transaction }))}>{transaction.reference}</button></td>
                  <td><div className="transaction-name">{transaction.type}</div><div className="transaction-description">{transaction.description}</div></td>
                  <td>{transaction.party}</td>
                  <td className="date-cell">{formatDate(transaction.date)}</td>
                  <td className="amount-cell">{formatCurrency(transaction.amount)}</td>
                  <td><StatusBadge status={transaction.status} /></td>
                  <td><button className="table-more" onClick={() => window.dispatchEvent(new CustomEvent('radium:show-transaction', { detail: transaction }))} aria-label={`Open ${transaction.reference}`}><ArrowRight size={15} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-bottom"><span>Showing 6 of 8 demo records</span><span>Last refreshed just now</span></div>
      </section>

      <div className="dashboard-grid foundation-row">
        <section className="panel foundation-panel">
          <div className="panel-heading"><div><h2>Platform foundation</h2><p>Shared services supporting the workspace</p></div><span className="foundation-state"><i /> Simulated</span></div>
          <div className="foundation-list">
            <div><div className="foundation-icon"><Layers3 size={16} /></div><span><strong>Shared Business Data Graph</strong><small>Common business record model</small></span><StatusBadge status="Simulated" /></div>
            <div><div className="foundation-icon"><Activity size={16} /></div><span><strong>Event-driven backbone</strong><small>Business event stream</small></span><StatusBadge status="Simulated" /></div>
            <div><div className="foundation-icon"><ShieldCheck size={16} /></div><span><strong>Identity & access</strong><small>Demo role context · Administrator</small></span><StatusBadge status="Simulated" /></div>
            <div><div className="foundation-icon"><FileText size={16} /></div><span><strong>Audit trail</strong><small>Illustrative activity history</small></span><StatusBadge status="Simulated" /></div>
          </div>
        </section>
        <section className="panel integration-panel">
          <div className="panel-heading"><div><h2>Application references</h2><p>External system references</p></div><span className="connected-count">1 reference</span></div>
          <div className="integration-card">
            <div className="aria-mark">A</div>
            <div className="integration-copy"><strong>ARIA CRM</strong><span>Customer, opportunity and service references</span><small>Separate application · Integration simulated</small></div>
            <StatusBadge status="Simulated" />
          </div>
          <div className="integration-foot"><span>Last simulated sync</span><strong>Today, 10:42 AM</strong></div>
          <button className="integration-link" onClick={() => window.dispatchEvent(new Event('radium:open-aria'))}>View integration references <ArrowRight size={14} /></button>
        </section>
      </div>
      <div className="footer-assumption">Dashboard metrics are illustrative and use USD as the demo display currency. Production metric definitions, legal entities, reporting periods and data sources must be configured against the approved Radium implementation.</div>
    </div>
  );
}

function ActivityIcon() { return <Activity size={17} />; }
