import { useState } from 'react';
import {
    ChevronLeft, ChevronRight, Target, Briefcase, Camera, Video, Plane
} from 'lucide-react';
import { useApp } from '../../hooks/AppContext';

export function CalendarModule() {
    const { leads, sessions, clients } = useApp();
    const [currentDate, setCurrentDate] = useState(new Date());

    const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Unknown Client';

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase();

    // Map lead events
    const leadEventsByDay = leads.reduce((acc, lead) => {
        if (!lead.shootDate) return acc;
        const day = new Date(lead.shootDate).getDate();
        const month = new Date(lead.shootDate).getMonth();
        const year = new Date(lead.shootDate).getFullYear();
        if (month === currentDate.getMonth() && year === currentDate.getFullYear()) {
            acc[day] = acc[day] || [];
            acc[day].push({ type: 'lead', data: lead });
        }
        return acc;
    }, {} as Record<number, any[]>);

    // Map session events
    const sessionEventsByDay = sessions.reduce((acc, session) => {
        if (session.stage === 'Closed') return acc; // Skip closed projects
        
        const clientName = getClientName(session.clientId);
        
        (session.events || []).forEach(event => {
            if (!event.date) return;
            const day = new Date(event.date).getDate();
            const month = new Date(event.date).getMonth();
            const year = new Date(event.date).getFullYear();
            
            if (month === currentDate.getMonth() && year === currentDate.getFullYear()) {
                acc[day] = acc[day] || [];
                acc[day].push({ type: 'project', clientName, eventData: event });
            }
        });
        return acc;
    }, {} as Record<number, any[]>);

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="h-40 lg:h-48 bg-secondary/10 border-r border-b border-border/50"></div>);
    }

    const renderServiceIcon = (service: string) => {
        const lower = service.toLowerCase();
        if (lower.includes('photo')) return <Camera size={8} />;
        if (lower.includes('video')) return <Video size={8} />;
        if (lower.includes('drone')) return <Plane size={8} />;
        return null;
    };

    for (let day = 1; day <= daysInMonth; day++) {
        const leadEvents = leadEventsByDay[day] || [];
        const projEvents = sessionEventsByDay[day] || [];
        const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();

        days.push(
            <div key={day} className={`h-40 lg:h-48 p-3 flex flex-col gap-1 border-r border-b border-border/50 relative group transition-colors hover:bg-secondary/20 overflow-hidden ${isToday ? 'bg-primary/5' : ''}`}>
                <span className={`text-xs font-black tracking-widest ${isToday ? 'text-primary' : 'text-muted-foreground/60'}`}>{day}</span>
                <div className="flex flex-col gap-1.5 max-h-full overflow-y-auto no-scrollbar pt-1 pr-1 pb-4">
                    {leadEvents.map((e, i) => (
                        <div key={`l-${i}`} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 px-2 py-1.5 rounded text-[9px] font-black uppercase tracking-wider truncate flex items-center gap-1 shrink-0 shadow-sm">
                            <Target size={8} className="shrink-0" /> <span className="truncate">{e.data.name}</span>
                        </div>
                    ))}
                    {projEvents.map((e, i) => (
                        <div key={`p-${i}`} className="bg-primary text-white border border-primary px-2 py-2 rounded flex flex-col gap-1.5 shrink-0 shadow-sm overflow-hidden">
                            <div className="text-[9px] font-black uppercase tracking-wider truncate flex items-center gap-1.5 opacity-90">
                                <Briefcase size={9} className="shrink-0" /> 
                                <span className="truncate">{e.clientName}</span>
                            </div>
                            <div className="text-[10px] font-bold leading-tight truncate">
                                {e.eventData.name}
                            </div>
                            {e.eventData.services && e.eventData.services.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {e.eventData.services.map((svc: string, idx: number) => (
                                        <div key={idx} className="bg-white/20 px-1.5 py-0.5 rounded-[3px] text-[8px] font-bold uppercase tracking-widest flex items-center gap-1 shrink-0" title={svc}>
                                            {renderServiceIcon(svc)}
                                            <span className="truncate max-w-[60px]">{svc}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {isToday && <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-primary rounded-full shadow-lg shadow-primary/50"></div>}
            </div>
        );
    }

    return (
        <div className="space-y-8 h-full flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-foreground">CALENDAR</h1>
                    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground mt-1">Schedule & Availability</p>
                </div>
                <div className="flex items-center gap-4 bg-secondary/50 p-2 rounded-2xl border border-white/5">
                    <button onClick={prevMonth} className="p-2 hover:bg-white dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground rounded-xl transition-all"><ChevronLeft size={20} /></button>
                    <span className="text-sm font-black tracking-[0.2em] px-4 min-w-[180px] text-center">{monthYear}</span>
                    <button onClick={nextMonth} className="p-2 hover:bg-white dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground rounded-xl transition-all"><ChevronRight size={20} /></button>
                </div>
            </header>

            {/* Grid */}
            <div className="card-premium !p-0 overflow-hidden flex-1 shadow-2xl flex flex-col">
                <div className="grid grid-cols-7 border-b border-border/50 bg-secondary/30 shrink-0">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center border-r border-border/50">
                            {d}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 flex-1 overflow-auto bg-white/5">
                    {days}
                </div>
            </div>

            {/* Legend */}
            <div className="flex gap-6 px-2 shrink-0 pb-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Prospect Leads</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-sm"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Production Projects</span>
                </div>
            </div>
        </div>
    );
}
