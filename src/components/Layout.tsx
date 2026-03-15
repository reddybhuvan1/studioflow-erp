import { useState, type ReactNode } from 'react';
import { LayoutDashboard, Heart, Settings, LogOut, Bell, Search, User, Target, Calendar as CalendarIcon, Wallet, ActivitySquare, Package, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../hooks/AppContext';

export function Layout({ children, currentView, onViewChange }: {
    children: ReactNode;
    currentView: string;
    onViewChange: (view: any) => void;
}) {
    const { logout, user } = useApp();
    const isAdmin = user?.role === 'admin';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const allMenuItems = [
        { id: 'Dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { id: 'Clients', icon: <User size={20} />, label: 'Clients' },
        { id: 'Leads', icon: <Target size={20} />, label: 'Leads' },
        { id: 'Calendar', icon: <CalendarIcon size={20} />, label: 'Calendar' },
        { id: 'Production', icon: <LayoutDashboard size={20} />, label: 'Production' },
        { id: 'Employees', icon: <Heart size={20} />, label: 'Staff' },
        { id: 'Freelancers', icon: <User size={20} />, label: 'Freelancers' },
        { id: 'Expenses', icon: <Wallet size={20} />, label: 'Expenses' },
        { id: 'Financials', icon: <ActivitySquare size={20} />, label: 'Financials' },
        { id: 'Equipment', icon: <Package size={20} />, label: 'Equipment' },
        { id: 'Settings', icon: <Settings size={20} />, label: 'Settings' },
    ];

    const menuItems = allMenuItems.filter(item => {
        if (isAdmin) return true;
        if (item.id === 'Dashboard') return true; // Always visible
        if (item.id === 'Settings') return true; // Always visible
        if (item.id === 'Employees') return false; // Never visible to standard employees
        return user?.permissions?.includes(item.id) ?? false;
    });

    const handleNavClick = (id: string) => {
        onViewChange(id);
        setIsMobileMenuOpen(false); // Close menu on mobile after selection
    };

    return (
        <div className="flex h-screen bg-background overflow-hidden font-sans relative">
            {/* Mobile Overlay Backdrop */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 flex flex-col p-4 md:p-6 transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0
            `}>
                <div className="card-premium h-full flex flex-col p-6 shadow-2xl shadow-primary/5 relative">
                    {/* Mobile Close Button */}
                    <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="absolute right-4 top-4 p-2 text-muted-foreground hover:text-foreground md:hidden rounded-full hover:bg-secondary transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-center gap-4 mb-8 md:mb-12 px-2 mt-2 md:mt-0">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-black dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black font-black text-xl md:text-2xl shadow-xl transition-transform hover:scale-105 shrink-0">
                            K
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-lg md:text-xl tracking-tight text-foreground leading-none">WEDDINGS</span>
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mt-1">BY KRANTHI</span>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-1 md:space-y-2 overflow-y-auto pr-2 -mr-2">
                        {menuItems.map((item) => (
                            <NavItem
                                key={item.id}
                                icon={item.icon}
                                label={item.label}
                                active={currentView === item.id}
                                onClick={() => handleNavClick(item.id)}
                            />
                        ))}
                    </nav>

                    <div className="mt-auto pt-6 md:pt-8 space-y-2 shrink-0">
                        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-4 md:mb-6"></div>
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-4 px-4 md:px-6 py-3 md:py-4 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300 font-bold group"
                        >
                            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
                            <span className="text-sm md:text-base">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Header */}
                <header className="h-20 md:h-24 flex items-center px-4 md:px-12 justify-between shrink-0 border-b border-border/40 md:border-none z-10 bg-background/80 backdrop-blur-md md:bg-transparent">
                    <div className="flex items-center gap-4 flex-1">
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 -ml-2 text-foreground hover:bg-secondary rounded-xl md:hidden transition-colors"
                        >
                            <Menu size={24} />
                        </button>

                        <div className="relative w-full max-w-[200px] sm:max-w-xs md:max-w-sm lg:w-96 group hidden sm:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Universal search..."
                                className="w-full bg-secondary/50 border-none rounded-2xl py-2.5 md:py-3 pl-10 md:pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-8 justify-end">
                        <button className="relative p-2 md:p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all">
                            <Bell size={20} className="md:w-5 md:h-5 w-4 h-4" />
                            <span className="absolute top-1.5 md:top-2 right-1.5 md:right-2 w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full border-2 border-background animate-pulse"></span>
                        </button>

                        <div className="flex items-center gap-3 md:gap-4 pl-3 md:pl-4 border-l border-border">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-foreground">{user?.name || 'User'}</p>
                                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{user?.role === 'admin' ? 'Creative Director' : 'Studio Staff'}</p>
                            </div>
                            <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl bg-secondary p-0.5 ring-1 ring-border transition-all overflow-hidden relative shrink-0">
                                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}&backgroundColor=000000`} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-12 pt-4 md:pt-4">
                    <motion.div
                        key={currentView}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full"
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
                w-full flex items-center gap-3 md:gap-4 px-3 md:px-4 py-3 md:py-3.5 rounded-xl transition-all duration-300 group relative
                ${active
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}
            `}
        >
            <span className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'} flex-shrink-0`}>
                {icon}
            </span>
            <span className="font-bold text-sm tracking-wide truncate">{label}</span>
            {active && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full opacity-50"
                />
            )}
        </button>
    );
}

