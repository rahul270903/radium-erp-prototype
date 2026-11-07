import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity, ArrowDownLeft, ArrowRight, Bell, Check, ChevronDown, ChevronLeft, ChevronRight,
  CircleHelp, Command, ExternalLink, FileSearch, LayoutDashboard, LogOut, Menu, Search,
  Settings, ShieldCheck, Sparkles, X,
} from 'lucide-react';
import { navGroups, allModules, type ModuleLink } from './data/navigation';
import { notifications as seedNotifications, transactions, type Transaction } from './data/mockData';
import { Dashboard } from './features/dashboard/Dashboard';
import { FinanceWorkspace } from './features/finance/FinanceWorkspace';
import { SupplyWorkspace } from './features/supply/SupplyWorkspace';
import { Phase4Workspace } from './features/phase4/Phase4Workspace';
import { Phase5Workspace } from './features/phase5/Phase5Workspace';
import { FinancePlanningWorkspace } from './features/phase6/FinancePlanningWorkspace';
import { AgentWorkspace, AriaIntegrationWorkspace, PlatformWorkspace, RetailWorkspace } from './features/final/FinalPhaseWorkspace';
import { StatusBadge } from './components/StatusBadge';
import { SectionHeading } from './components/SectionHeading';
import { formatCurrency, formatDate } from './lib/format';

function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>(['Finance & Planning']);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [role, setRole] = useState('Enterprise Administrator');
  const [noticeList, setNoticeList] = useState(seedNotifications);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [toast, setToast] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const unreadCount = noticeList.filter((notice) => notice.unread).length;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); setSearchOpen(true);
      }
      if (event.key === 'Escape') { setSearchOpen(false); setNotificationOpen(false); setProfileOpen(false); setSelectedTransaction(null); }
    };
    const onSearch = () => setSearchOpen(true);
    const onInbox = () => { setSearchOpen(false); showToast('Unified inbox belongs to the upcoming Platform Foundation work. Your current demo queue is shown on the dashboard.'); };
    const onTransaction = (event: Event) => setSelectedTransaction((event as CustomEvent<Transaction>).detail);
    const onAria = () => navigate('/integrations/aria');
    const onRefresh = () => showToast('Demo dashboard refreshed. No live system data was queried.');
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('radium:open-search', onSearch);
    window.addEventListener('radium:open-inbox', onInbox);
    window.addEventListener('radium:show-transaction', onTransaction);
    window.addEventListener('radium:open-aria', onAria);
    window.addEventListener('radium:refresh', onRefresh);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('radium:open-search', onSearch);
      window.removeEventListener('radium:open-inbox', onInbox);
      window.removeEventListener('radium:show-transaction', onTransaction);
      window.removeEventListener('radium:open-aria', onAria);
      window.removeEventListener('radium:refresh', onRefresh);
    };
  }, [navigate]);

  useEffect(() => {
    setMobileNavOpen(false);
    setNotificationOpen(false);
    setProfileOpen(false);
    const active = allModules.find((module) => module.path === location.pathname);
    if (active) setOpenGroups((groups) => groups.includes(active.group) ? groups : [...groups, active.group]);
  }, [location.pathname]);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 3200);
  }

  const breadcrumbs = useMemo(() => {
    if (location.pathname === '/') return ['Workspace', 'Dashboard'];
    const activeModule = allModules.find((module) => module.path === location.pathname);
    if (activeModule) return [activeModule.group, activeModule.label];
    if (location.pathname === '/integrations/aria') return ['Platform & Administration', 'ARIA Integration'];
    return ['Workspace', 'Module'];
  }, [location.pathname]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const moduleResults = allModules.filter((module) => !query || `${module.label} ${module.group} ${module.description}`.toLowerCase().includes(query)).slice(0, 7);
    const transactionResults = transactions.filter((record) => !query || `${record.reference} ${record.type} ${record.description} ${record.party}`.toLowerCase().includes(query)).slice(0, 5);
    return { moduleResults, transactionResults };
  }, [searchQuery]);

  const toggleGroup = (label: string) => setOpenGroups((groups) => groups.includes(label) ? groups.filter((group) => group !== label) : [...groups, label]);
  const selectModule = (module: ModuleLink) => { navigate(module.path); setSearchOpen(false); setSearchQuery(''); };

  return (
    <div className={`app-frame ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {mobileNavOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}
      <aside className={`sidebar ${mobileNavOpen ? 'mobile-open' : ''}`}>
        <div className="brand-row">
          <div className="brand-mark"><span>R</span></div>
          {!collapsed && <div className="brand-copy"><strong>RADIUM</strong><span>ENTERPRISE PLATFORM</span></div>}
          <button className="sidebar-collapse" onClick={() => setCollapsed(!collapsed)} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>{collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}</button>
        </div>
        <div className="tenant-switcher">
          <div className="tenant-avatar">SE</div>
          {!collapsed && <div className="tenant-details"><strong>Seiretsu Enterprise</strong><span>Primary workspace</span></div>}
          {!collapsed && <ChevronDown size={14} className="tenant-chevron" />}
        </div>
        <nav className="side-navigation" aria-label="Main navigation">
          <div className="nav-overline">WORKSPACE</div>
          <Link to="/" className={`nav-dashboard ${location.pathname === '/' ? 'active' : ''}`} title="Dashboard"><LayoutDashboard size={17} /><span>Dashboard</span><kbd>⌘ 1</kbd></Link>
          {!collapsed && <div className="nav-overline modules-overline">BUSINESS MODULES</div>}
          {navGroups.map((group) => {
            const Icon = group.icon;
            const expanded = openGroups.includes(group.label) && !collapsed;
            const groupActive = group.modules.some((module) => module.path === location.pathname);
            return (
              <div className={`nav-group ${groupActive ? 'group-active' : ''}`} key={group.label}>
                <button className={`nav-group-trigger ${expanded ? 'expanded' : ''}`} onClick={() => collapsed ? (setCollapsed(false), setOpenGroups([group.label])) : toggleGroup(group.label)} title={group.label}>
                  <Icon size={17} /><span>{group.label}</span>{!collapsed && <><span className="nav-item-count">{group.modules.length}</span><ChevronDown size={14} className="nav-chevron" /></>}
                </button>
                {expanded && <div className="nav-children">{group.modules.map((module) => {
                  const ModuleIcon = module.icon;
                  return <Link key={module.path} to={module.path} className={`nav-child ${location.pathname === module.path ? 'active' : ''}`}><span className="nav-child-dot" />{module.label}</Link>;
                })}</div>}
              </div>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <button className="sidebar-bottom-link" onClick={() => showToast('Help centre content will be connected in a later phase.')}><CircleHelp size={17} /><span>Help centre</span></button>
          <div className="sidebar-version"><span className="version-dot" />{!collapsed && <span>Prototype v0.3 · Phase 3</span>}</div>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu-button" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation"><Menu size={19} /></button>
            <div className="breadcrumbs"><span>{breadcrumbs[0]}</span><ChevronRight size={14} /><strong>{breadcrumbs[1]}</strong></div>
          </div>
          <div className="topbar-right">
            <button className="global-search-trigger" onClick={() => setSearchOpen(true)}><Search size={16} /><span>Search anything...</span><kbd><Command size={11} /> K</kbd></button>
            <div className="topbar-divider" />
            <div className="environment-chip"><span /> Demo environment</div>
            <div className="topbar-menu-wrap">
              <button className={`topbar-icon-button ${notificationOpen ? 'selected' : ''}`} onClick={() => { setNotificationOpen(!notificationOpen); setProfileOpen(false); }} aria-label="Notifications"><Bell size={18} />{unreadCount > 0 && <i className="notification-count">{unreadCount}</i>}</button>
              {notificationOpen && <div className="dropdown-panel notification-dropdown">
                <div className="dropdown-heading"><div><strong>Notifications</strong><span>{unreadCount} unread updates</span></div><button onClick={() => setNoticeList((items) => items.map((item) => ({ ...item, unread: false })))}>Mark all read</button></div>
                <div className="notification-list">{noticeList.map((notice) => <div className={`notification-item ${notice.unread ? 'unread' : ''}`} key={notice.id}><span className={`notification-symbol ${notice.tone}`}><Bell size={14} /></span><div><strong>{notice.title}</strong><p>{notice.body}</p><small>{notice.time}</small></div><button className="notification-read" onClick={() => setNoticeList((items) => items.map((item) => item.id === notice.id ? { ...item, unread: false } : item))} aria-label="Mark as read">{notice.unread ? <span /> : <Check size={13} />}</button></div>)}</div>
                <div className="dropdown-bottom"><span>Demo notifications</span><span>View all <ArrowRight size={13} /></span></div>
              </div>}
            </div>
            <div className="topbar-menu-wrap profile-wrap">
              <button className={`profile-trigger ${profileOpen ? 'selected' : ''}`} onClick={() => { setProfileOpen(!profileOpen); setNotificationOpen(false); }}><span className="profile-avatar">DU</span><span className="profile-text"><strong>Demo User</strong><small>{role}</small></span><ChevronDown size={14} /></button>
              {profileOpen && <div className="dropdown-panel profile-dropdown"><div className="profile-dropdown-head"><span className="profile-avatar large">DU</span><div><strong>Demo User</strong><span>Demo workspace account</span></div></div><div className="role-switch-label">DEMO ROLE CONTEXT</div>{['Enterprise Administrator', 'Finance Controller', 'Procurement Manager', 'Operations Lead'].map((item) => <button key={item} className={`role-option ${role === item ? 'current' : ''}`} onClick={() => { setRole(item); setProfileOpen(false); showToast(`Demo role switched to ${item}. Permissions are illustrative only.`); }}>{item}{role === item && <Check size={14} />}</button>)}<div className="profile-dropdown-footer"><ShieldCheck size={14} /> Role switching is a UI simulation</div></div>}
            </div>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/integrations/aria" element={<AriaIntegrationWorkspace />} />
            <Route path="*" element={<ModulePage />} />
          </Routes>
        </main>
        <footer className="app-footer"><span>© 2026 Radium ERP · Interactive product prototype</span><span><i /> Demo workspace · Not connected to production systems</span></footer>
      </div>

      {searchOpen && <div className="modal-backdrop search-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSearchOpen(false)}><div className="search-modal" role="dialog" aria-modal="true" aria-label="Global search"><div className="search-input-row"><Search size={19} /><input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search modules, transactions, suppliers..." /><kbd>ESC</kbd><button className="close-button" onClick={() => setSearchOpen(false)} aria-label="Close search"><X size={17} /></button></div><div className="search-results">
        {searchResults.moduleResults.length > 0 && <><div className="search-group-label">MODULES & WORKSPACES</div>{searchResults.moduleResults.map((module) => { const Icon = module.icon ?? FileSearch; return <button className="search-result" key={module.path} onClick={() => selectModule(module)}><span className="search-result-icon"><Icon size={16} /></span><span><strong>{module.label}</strong><small>{module.group}</small></span><span className="search-result-phase">{module.phase}</span><ArrowRight size={15} /></button>; })}</>}
        {searchResults.transactionResults.length > 0 && <><div className="search-group-label second">TRANSACTION RECORDS · DEMO</div>{searchResults.transactionResults.map((record) => <button className="search-result" key={record.id} onClick={() => { setSelectedTransaction(record); setSearchOpen(false); }}><span className="search-result-icon"><FileSearch size={16} /></span><span><strong>{record.reference} · {record.type}</strong><small>{record.party} · {record.description}</small></span><span className="search-result-amount">{formatCurrency(record.amount)}</span><ArrowRight size={15} /></button>)}</>}
        {searchResults.moduleResults.length === 0 && searchResults.transactionResults.length === 0 && <div className="empty-search"><Search size={26} /><strong>No results found</strong><span>Try a module name, reference number or counterparty.</span></div>}
      </div><div className="search-modal-footer"><span>Type to filter results</span><span>Click a result to open</span><span>Local search · demo records and module metadata</span></div></div></div>}

      {selectedTransaction && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSelectedTransaction(null)}><div className="detail-modal" role="dialog" aria-modal="true" aria-label="Transaction detail"><div className="detail-modal-top"><div><span className="eyebrow">DEMO TRANSACTION RECORD</span><h2>{selectedTransaction.reference}</h2></div><button className="close-button" onClick={() => setSelectedTransaction(null)} aria-label="Close details"><X size={18} /></button></div><div className="detail-modal-content"><div className="detail-title-row"><div><strong>{selectedTransaction.type}</strong><p>{selectedTransaction.description}</p></div><StatusBadge status={selectedTransaction.status} /></div><div className="detail-amount"><span>Transaction amount</span><strong>{formatCurrency(selectedTransaction.amount)}</strong><small>{selectedTransaction.currency} · illustrative demo value</small></div><div className="detail-fields"><div><span>Counterparty</span><strong>{selectedTransaction.party}</strong></div><div><span>Transaction date</span><strong>{formatDate(selectedTransaction.date)}</strong></div><div><span>Prepared by</span><strong>{selectedTransaction.owner}</strong></div><div><span>Reference</span><strong>{selectedTransaction.reference}</strong></div></div><div className="detail-simulation-note"><ShieldCheck size={17} /><span>This dashboard sample is read-only. Writable finance transactions are available in the Phase 2 finance workspaces.</span></div></div><div className="detail-modal-footer"><button className="btn btn-secondary" onClick={() => setSelectedTransaction(null)}>Close</button><button className="btn btn-primary" onClick={() => { setSelectedTransaction(null); showToast('Transaction editing will be introduced with the relevant workflow phase.'); }}>View workflow plan <ArrowRight size={15} /></button></div></div></div>}

      {toast && <div className="toast-message"><Check size={16} />{toast}</div>}
    </div>
  );
}

function ModulePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const financePaths = ['/finance/general-ledger','/finance/subledger','/finance/accounts-payable','/finance/accounts-receivable','/finance/expenses'];
  if (financePaths.includes(location.pathname)) return <FinanceWorkspace pathname={location.pathname} />;
  const supplyPaths = ['/procurement/requisitions','/procurement/purchase-orders','/procurement/suppliers','/inventory/management','/inventory/valuation','/inventory/transfers','/inventory/adjustments','/warehouse/operations','/warehouse/goods-receipts'];
  if (supplyPaths.includes(location.pathname)) return <SupplyWorkspace pathname={location.pathname} />;
  const phase4Paths = ['/sales/customer-master','/sales/orders','/sales/pricing-credit','/sales/shipping-billing','/assets/management','/assets/work-orders','/projects/management'];
  if (phase4Paths.includes(location.pathname)) return <Phase4Workspace key={location.pathname} pathname={location.pathname} />;
  const phase5Paths = ['/manufacturing/product-engineering','/manufacturing/production-planning','/quality/management','/logistics/transportation','/service/field-service','/people/hcm','/ehs/management'];
  if (phase5Paths.includes(location.pathname)) return <Phase5Workspace key={location.pathname} pathname={location.pathname} />;
  const phase6Paths = ['/finance/management-accounting', '/finance/epm'];
  if (phase6Paths.includes(location.pathname)) return <FinancePlanningWorkspace key={location.pathname} pathname={location.pathname} />;
  if (location.pathname === '/retail/pos') return <RetailWorkspace />;
  const platformPaths = ['/platform/workflows','/platform/identity','/platform/integrations','/platform/analytics','/platform/audit','/platform/ai-governance'];
  if (platformPaths.includes(location.pathname)) return <PlatformWorkspace key={location.pathname} pathname={location.pathname} />;
  if (location.pathname === '/ai/agents') return <AgentWorkspace />;
  const module = allModules.find((item) => item.path === location.pathname);
  if (!module) return <div className="not-found panel"><div className="not-found-icon"><FileSearch size={25} /></div><h1>Workspace not found</h1><p>The requested route is not part of the current prototype build.</p><button className="btn btn-primary" onClick={() => navigate('/')}>Return to dashboard</button></div>;
  const Icon = module.icon ?? Activity;
  return <div className="page-stack"><SectionHeading eyebrow={`${module.group.toUpperCase()} / MODULE WORKSPACE`} title={module.label} subtitle={module.description} action={<span className="phase-chip">Planned delivery · {module.phase}</span>} /><div className="module-intro-grid"><div className="panel module-hero"><div className="module-hero-icon"><Icon size={23} /></div><div className="eyebrow">RADlUM ERP MODULE</div><h2>{module.label}</h2><p>{module.description}</p><div className="module-hero-note"><span className="phase-dot" /> Navigation and workspace route are active. Detailed records and writable workflows will be delivered in {module.phase}.</div></div><div className="panel module-scope"><div className="panel-heading"><div><h2>Delivery scope</h2><p>Prototype build status</p></div><span className="phase-chip">Phase 1</span></div><div className="scope-row"><span>Navigation & routing</span><StatusBadge status="Approved" /></div><div className="scope-row"><span>Workspace shell</span><StatusBadge status="Approved" /></div><div className="scope-row"><span>Module-specific records</span><StatusBadge status="Draft" /></div><div className="scope-row"><span>Writable transactions</span><StatusBadge status="Draft" /></div><div className="scope-row"><span>Live backend integration</span><StatusBadge status="Draft" /></div></div></div><div className="dashboard-grid module-lower-grid"><div className="panel module-next"><div className="panel-heading"><div><h2>What this workspace will contain</h2><p>Capabilities based on the Radium module definition</p></div></div><div className="module-capabilities"><div><Check size={15} /><span>Module overview and governed business metrics</span></div><div><Check size={15} /><span>Record list with search, filters and sorting</span></div><div><Check size={15} /><span>Detailed transaction entry and validation</span></div><div><Check size={15} /><span>Approval lifecycle and activity history</span></div><div><Check size={15} /><span>Related records across connected modules</span></div></div><div className="module-note">The detailed fields and state transitions will be mapped to the applicable VEC-950-ERS requirements during the module's implementation phase.</div></div><div className="panel module-related"><div className="panel-heading"><div><h2>Related workspaces</h2><p>Explore the connected module navigation</p></div></div>{allModules.filter((item) => item.group === module.group && item.path !== module.path).slice(0, 5).map((item) => <button className="related-module" key={item.path} onClick={() => navigate(item.path)}><span>{item.label}</span><ArrowRight size={15} /></button>)}{allModules.filter((item) => item.group === module.group && item.path !== module.path).length === 0 && <p className="empty-related">No sibling workspace is listed in this navigation group.</p>}</div></div></div>;
}


export default function App() {
  return <BrowserRouter><AppShell /></BrowserRouter>;
}
