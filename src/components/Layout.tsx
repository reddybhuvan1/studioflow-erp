import type { ReactNode } from 'react';
import { LayoutDashboard, Heart, Settings, LogOut, Bell, Search, User, Target, Calendar as CalendarIcon, Wallet, ActivitySquare, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../hooks/AppContext';

export function Layout({ children, currentView, onViewChange }: {
    children: ReactNode;
    currentView: string;
    onViewChange: (view: any) => void;
}) {
    const { logout, user } = useApp();
    const isAdmin = user?.role === 'admin';

    const menuItems = [
        { id: 'Dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { id: 'Clients', icon: <User size={20} />, label: 'Clients' },
        { id: 'Leads', icon: <Target size={20} />, label: 'Leads' },
        { id: 'Calendar', icon: <CalendarIcon size={20} />, label: 'Calendar' },
        { id: 'Production', icon: <LayoutDashboard size={20} />, label: 'Production' },
        ...(isAdmin ? [{ id: 'Employees', icon: <Heart size={20} />, label: 'Staff' }] : []),
        { id: 'Freelancers', icon: <User size={20} />, label: 'Freelancers' },
        { id: 'Expenses', icon: <Wallet size={20} />, label: 'Expenses' },
        { id: 'Financials', icon: <ActivitySquare size={20} />, label: 'Financials' },
        { id: 'Equipment', icon: <Package size={20} />, label: 'Equipment' },
        { id: 'Settings', icon: <Settings size={20} />, label: 'Settings' },
    ];

    return (
        <div className="flex h-screen bg-background overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-72 relative z-20 flex flex-col p-6 h-full">
                <div className="card-premium h-full flex flex-col p-6 shadow-2xl shadow-primary/5">
                    <div className="flex items-center gap-4 mb-12 px-2">
                        <div className="w-12 h-12 bg-black dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black font-black text-2xl shadow-xl transition-transform hover:scale-105">
                            K
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-xl tracking-tight text-foreground leading-none">WEDDINGS</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mt-1">BY KRANTHI</span>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {menuItems.map((item) => (
                            <NavItem
                                key={item.id}
                                icon={item.icon}
                                label={item.label}
                                active={currentView === item.id}
                                onClick={() => onViewChange(item.id)}
                            />
                        ))}
                    </nav>

                    <div className="mt-auto pt-8 space-y-2">
                        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6"></div>
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300 font-bold group"
                        >
                            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Header */}
                <header className="h-24 flex items-center px-12 justify-between shrink-0">
                    <div className="relative w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Universal search..."
                            className="w-full bg-secondary/50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
                        />
                    </div>

                    <div className="flex items-center gap-8">
                        <button className="relative p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background animate-pulse"></span>
                        </button>

                        <div className="flex items-center gap-4 pl-4 border-l border-border">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-foreground">{user?.name || 'User'}</p>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{user?.role === 'admin' ? 'Creative Director' : 'Studio Staff'}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-secondary p-0.5 ring-1 ring-border transition-all overflow-hidden relative">
                                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}&backgroundColor=000000`} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-12 pt-4">
                    <motion.div
                        key={currentView}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {children}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}

function NavItem({
    icon,
    label,
    active = false,
    onClick
}: {
    icon: ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`
                w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative
                ${active
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}
            `}
        >
            <span className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                {icon}
            </span>
            <span className="font-bold text-sm tracking-wide">{label}</span>
            {active && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full opacity-50"
                />
            )}
        </button>
    );
}

