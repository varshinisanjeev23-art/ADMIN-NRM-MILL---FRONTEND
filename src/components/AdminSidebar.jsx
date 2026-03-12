import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { to: '/admin/products', label: 'Products', icon: BoxIcon },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarIcon },
  { to: '/admin/payments', label: 'Transactions', icon: WalletIcon },
  { to: '/admin/messages', label: 'Messages', icon: MessageIcon },
  { to: '/admin/users', label: 'Users', icon: UsersIcon },
  { to: '/admin/careers', label: 'Job Applications', icon: BriefcaseIcon },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white w-64 h-screen p-6 shadow-2xl flex flex-col border-r border-white/10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-xl font-extrabold shadow-lg">
          NRM
        </div>
        <div>
          <p className="text-xs uppercase text-slate-400 tracking-[0.25em]">Admin</p>
          <p className="text-lg font-extrabold">Control</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {links.map(({ to, label, icon: Icon }) => {
          const active = location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl border transition-all transform-gpu hover:-translate-y-0.5 ${
                active
                  ? 'bg-white/10 border-white/20 shadow-lg'
                  : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-blue-300' : 'text-slate-300'} group-hover:text-blue-200`} />
              <span className={`text-sm font-semibold ${active ? 'text-white' : 'text-slate-200'} group-hover:text-white`}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/10 text-xs text-slate-400">
        <p className="font-semibold text-slate-200">System Status</p>
        <div className="mt-2 flex items-center gap-2 text-emerald-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          All services operational
        </div>
      </div>
    </aside>
  );
}

function DashboardIcon(props) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h7v7H3V3zm11 0h7v4h-7V3zM3 14h7v7H3v-7zm11-5h7v12h-7V9z" />
    </svg>
  );
}

function BoxIcon(props) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 16V8a2 2 0 00-1.106-1.79l-7-3.5a2 2 0 00-1.788 0l-7 3.5A2 2 0 003 8v8a2 2 0 001.106 1.79l7 3.5a2 2 0 001.788 0l7-3.5A2 2 0 0021 16z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.27 6.96L12 12l8.73-5.04M12 22V12" />
    </svg>
  );
}

function CalendarIcon(props) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10m-11 8h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function WalletIcon(props) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18v10H3z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12h2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-4 9 4" />
    </svg>
  );
}

function MessageIcon(props) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h6m-9 8l4-4h10a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function UsersIcon(props) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8a4 4 0 110-8 4 4 0 010 8zm10 8v-2a4 4 0 00-3-3.87" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 11a4 4 0 100-8 4 4 0 000 8z" />
    </svg>
  );
}

function BriefcaseIcon(props) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
