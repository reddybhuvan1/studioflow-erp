import { useApp } from '../../hooks/AppContext';

import { Target, Briefcase, ChevronRight, PieChart, TrendingUp, CheckCircle, Calendar, IndianRupee } from 'lucide-react';

export function HomeDashboard() {
    const { leads, sessions, clients } = useApp();

    const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Unknown';

    const upcomingEvents = [
        ...leads.filter(l => l.shootDate).map(l => ({ name: l.name, date: l.shootDate, tag: 'Lead' as const })),
        ...sessions.flatMap(s => (s.events || []).map(e => ({ name: `${getClientName(s.clientId)} - ${e.name}`, date: e.date, tag: 'Project' as const })))
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .filter(event => new Date(event.date).getTime() >= new Date().getTime() - 86400000)
        .slice(0, 5);

    const recentLeads = [...leads]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    const activeSessions = [...sessions]
        .filter(s => s.stage !== 'Closed')
        .slice(0, 5);

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            <header className="flex justify-between items-end pb-8 border-b border-black/5">
                <div>
                    <h2 className="text-5xl font-light tracking-tighter text-foreground mb-1 uppercase">STUDIO</h2>
                    <h2 className="text-2xl font-black tracking-[0.3em] text-foreground/40 leading-none">OVERVIEW</h2>
                </div>
            </header>

            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 card-premium p-0 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border/50">
                    <div className="flex-1 p-6 flex flex-col justify-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
                            <Target size={14} className="text-primary" /> Active Leads
                        </span>
                        <div className="text-4xl font-black">{leads.length}</div>
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
                            <Briefcase size={14} className="text-primary" /> Active Projects
                        </span>
                        <div className="text-4xl font-black">{sessions.filter(s => s.stage !== 'Closed').length}</div>
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-center bg-primary/5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                            <IndianRupee size={14} /> Expected revenue
                        </span>
                        <div className="text-4xl font-black text-primary">
                            ₹{sessions.reduce((acc, s) => acc + s.grandTotal, 0).toLocaleString('en-IN')}
                        </div>
                    </div>
                </div>

                {/* Lead Sources Pie Chart Widget */}
                <div className="card-premium p-6 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-4 left-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <PieChart size={14} /> Sources
                    </div>
                    <div className="w-32 h-32 rounded-full conic-gradient-sources shadow-xl shadow-primary/5 mt-6 mb-4 relative flex items-center justify-center">
                         <div className="w-16 h-16 bg-white rounded-full"></div>
                    </div>
                    <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Instagram</div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-violet-500"></div> Referral</div>
                    </div>
                </div>
            </div>

            {/* Revenue Line Chart Widget Placeholder */}
            <div className="card-premium p-6 h-64 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <TrendingUp size={14} className="text-primary" /> Revenue Comparison
                    </span>
                    <div className="flex gap-2">
                        {['7 Days', '30 Days', 'Mtd', 'Ytd'].map((t, i) => (
                            <button key={t} className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest ${i === 1 ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/50'}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 relative w-full flex items-end justify-between px-4 pb-2">
                    {/* CSS mock line chart */}
                    <div className="absolute bottom-6 left-0 right-0 h-px bg-border/50"></div>
                    <div className="absolute bottom-12 left-0 right-0 h-px bg-border/50"></div>
                    <div className="absolute bottom-18 left-0 right-0 h-px bg-border/50"></div>
                    
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path d="M0,90 L20,80 L40,85 L60,60 L80,30 L100,10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/30" />
                        <path d="M0,95 L20,90 L40,70 L60,50 L80,55 L100,20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
                    </svg>
                    
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => (
                        <span key={m} className="text-[9px] font-black uppercase text-muted-foreground relative z-10">{m}</span>
                    ))}
                </div>
            </div>

            {/* Bottom Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Upcoming Shoots */}
                <div className="card-premium p-0 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-border/50 flex justify-between items-center bg-secondary/30">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Calendar size={14} /> Upcoming Shoots & Appointments
                        </span>
                    </div>
                    <div className="flex-1 p-6 space-y-4">
                        {upcomingEvents.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground text-sm font-bold">No upcoming events scheduled.</div>
                        ) : upcomingEvents.map((evt, i) => (
                            <div key={i} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="text-xs font-bold text-muted-foreground w-16">
                                        {new Date(evt.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                    </div>
                                    <div className="font-black group-hover:text-primary transition-colors">{evt.name}</div>
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${evt.tag === 'Lead' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                                    {evt.tag}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Leads */}
                <div className="card-premium p-0 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-border/50 flex justify-between items-center bg-secondary/30">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Target size={14} /> Most Recent Leads
                        </span>
                    </div>
                    <div className="flex-1 p-6 space-y-4">
                        {recentLeads.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground text-sm font-bold">No leads found.</div>
                        ) : recentLeads.map((lead, i) => (
                            <div key={i} className="flex items-center justify-between group">
                                <div className="flex flex-col">
                                    <div className="font-black group-hover:text-primary transition-colors">{lead.name}</div>
                                    <div className="text-[10px] font-bold text-muted-foreground">
                                        Received: {new Date(lead.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-black uppercase tracking-widest bg-secondary text-muted-foreground px-2 py-1 rounded">
                                        {lead.status}
                                    </span>
                                    <ChevronRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Job Tasks -> Active Projects */}
                <div className="card-premium p-0 overflow-hidden flex flex-col lg:col-span-2">
                    <div className="p-6 border-b border-border/50 flex justify-between items-center bg-secondary/30">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <CheckCircle size={14} /> Active Production Projects
                        </span>
                    </div>
                    <div className="flex-1 p-6">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[9px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">
                                    <th className="pb-4 font-black">Project ID</th>
                                    <th className="pb-4 font-black">Client Name</th>
                                    <th className="pb-4 font-black">Current Stage</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {activeSessions.length === 0 ? (
                                    <tr><td colSpan={3} className="py-8 text-center text-sm font-bold text-muted-foreground">No active projects.</td></tr>
                                ) : activeSessions.map((session, i) => (
                                    <tr key={i} className="group hover:bg-secondary/20 transition-colors">
                                        <td className="py-4 text-xs font-bold text-primary">
                                            {session.id}
                                        </td>
                                        <td className="py-4 font-black">{getClientName(session.clientId)}</td>
                                        <td className="py-4 text-sm text-muted-foreground font-medium">{session.stage}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
