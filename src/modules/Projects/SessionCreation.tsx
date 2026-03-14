import { useState } from 'react';
import { useApp } from '../../hooks/AppContext';
import { Calendar, FileText, IndianRupee, CheckCircle, ChevronRight, Sparkles, Trash2, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProjectEvent } from '../../types';

const AVAILABLE_SERVICES = [
    'Traditional photo',
    'Traditional video',
    'Traditional video 2',
    'Candid photo',
    'Candid video',
    'Drone'
];

export function SessionCreation() {
    const { clients, createSession } = useApp();
    const [formData, setFormData] = useState({
        clientId: '',
        quotation: '',
        grandTotal: 0
    });
    const [events, setEvents] = useState<ProjectEvent[]>([{ name: '', date: '', dataSizeGB: 0, services: [] }]);
    const [success, setSuccess] = useState(false);

    const addEvent = () => setEvents([...events, { name: '', date: '', dataSizeGB: 0, services: [] }]);
    const removeEvent = (index: number) => {
        if (events.length > 1) {
            setEvents(events.filter((_, i) => i !== index));
        }
    };
    const updateEvent = (index: number, field: keyof ProjectEvent, value: any) => {
        const newEvents = [...events];
        newEvents[index] = { ...newEvents[index], [field]: value };
        setEvents(newEvents);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.clientId) return alert('Please select a client');
        if (events.some(ev => !ev.name || !ev.date)) return alert('Please fill in all event names and dates');

        createSession({
            id: `SESS-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            clientId: formData.clientId,
            events: events,
            quotation: formData.quotation,
            grandTotal: formData.grandTotal,
            stage: 'INTAKE',
            editingStatus: { photos: false, videos: false },
            isPaid: false,
            isDelivered: false,
            payments: [],
            clientEquipment: []
        });

        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            setFormData({
                clientId: '',
                quotation: '',
                grandTotal: 0
            });
            setEvents([{ name: '', date: '', dataSizeGB: 0, services: [] }]);
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 pb-16 md:pb-24">
            <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 pb-4 md:pb-8 border-b border-black/5">
                <div>
                    <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-foreground mb-1 uppercase">PROJECT</h2>
                    <h2 className="text-xl md:text-2xl font-black tracking-[0.3em] text-foreground/40 leading-none">INTAKE</h2>
                </div>
                <div className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 border border-black/10 text-[9px] font-black uppercase tracking-widest text-muted-foreground w-max">
                    <Sparkles size={14} className="text-black" /> MULTI-PHASE
                </div>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 md:p-12 border border-black/5 bg-white relative overflow-hidden"
            >
                <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Assign Client</label>
                            <div className="relative group">
                                <select
                                    className="w-full bg-zinc-50 border border-zinc-100 py-4 px-5 font-bold outline-none focus:border-black transition-all appearance-none pr-12"
                                    value={formData.clientId}
                                    onChange={e => setFormData({ ...formData, clientId: e.target.value })}
                                    required
                                >
                                    <option value="">Select established client...</option>
                                    {clients.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover:text-black transition-colors">
                                    <ChevronRight size={18} className="rotate-90" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Financial Projection (USD)</label>
                            <div className="relative group">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-black transition-colors" size={18} />
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    className="w-full bg-zinc-50 border border-zinc-100 py-4 pl-12 pr-5 font-black text-xl outline-none focus:border-black transition-all"
                                    value={formData.grandTotal}
                                    onChange={e => setFormData({ ...formData, grandTotal: parseFloat(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-end">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Project Events & Schedule</label>
                            <button
                                type="button"
                                onClick={addEvent}
                                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-black hover:opacity-60 transition-all"
                            >
                                <Plus size={14} /> Add Another Event
                            </button>
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {events.map((event, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start p-6 bg-zinc-50 border border-zinc-100 relative group"
                                    >
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                placeholder="Event Name (e.g. Wedding, Reception)"
                                                className="w-full bg-transparent border-b border-zinc-200 py-2 font-bold outline-none focus:border-black transition-all"
                                                value={event.name}
                                                onChange={e => updateEvent(index, 'name', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <div className="relative flex-1">
                                                <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                                                <input
                                                    type="date"
                                                    className="w-full bg-transparent border-b border-zinc-200 py-2 pl-6 font-bold outline-none focus:border-black transition-all"
                                                    value={event.date}
                                                    onChange={e => updateEvent(index, 'date', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="relative w-full sm:w-28 shrink-0 flex items-center gap-2 sm:block">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.1"
                                                    placeholder="GB"
                                                    className="w-full bg-transparent border-b border-zinc-200 py-2 pr-6 font-bold outline-none focus:border-black transition-all text-right"
                                                    value={event.dataSizeGB || ''}
                                                    onChange={e => updateEvent(index, 'dataSizeGB', parseFloat(e.target.value) || 0)}
                                                />
                                                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground mr-1">GB</span>
                                            </div>
                                            {events.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeEvent(index)}
                                                    className="p-2 text-zinc-400 hover:text-black transition-all shrink-0"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                        {/* Services Selection array */}
                                        <div className="md:col-span-2 mt-4 space-y-3">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Included Services</label>
                                            <div className="flex flex-wrap gap-2">
                                                {AVAILABLE_SERVICES.map(service => {
                                                    const isSelected = event.services?.includes(service);
                                                    return (
                                                        <button
                                                            key={service}
                                                            type="button"
                                                            onClick={() => {
                                                                const currentServices = event.services || [];
                                                                const updatedServices = isSelected
                                                                    ? currentServices.filter(s => s !== service)
                                                                    : [...currentServices, service];
                                                                updateEvent(index, 'services', updatedServices);
                                                            }}
                                                            className={`
                                                                px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 border
                                                                ${isSelected 
                                                                    ? 'bg-black text-white border-black' 
                                                                    : 'bg-white text-muted-foreground border-zinc-200 hover:border-black/30 hover:text-black'}
                                                            `}
                                                        >
                                                            {isSelected && <Check size={10} />}
                                                            {service}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Service Scope & Quotation Details</label>
                        <div className="relative group">
                            <FileText className="absolute left-4 top-4 text-muted-foreground group-focus-within:text-black transition-colors" size={18} />
                            <textarea
                                rows={6}
                                placeholder="Outline specific deliverables..."
                                className="w-full bg-zinc-50 border border-zinc-100 py-4 pl-12 pr-5 font-medium outline-none focus:border-black transition-all resize-none"
                                value={formData.quotation}
                                onChange={e => setFormData({ ...formData, quotation: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-zinc-100">
                        <div className="flex items-center gap-4 text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-loose max-w-sm">
                            <div className="p-3 bg-black text-white shrink-0"><Sparkles size={16} /></div>
                            <p>Projects enter the <span className="text-black">Intake</span> phase for technical classification.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={success}
                            className={`
                                relative w-full md:min-w-[280px] md:w-auto h-14 md:h-16 bg-black text-white font-black text-[9px] md:text-[10px] tracking-[0.4em] uppercase transition-all duration-500 overflow-hidden
                                ${success ? 'bg-zinc-800' : 'hover:bg-zinc-900'}
                            `}
                        >
                            <AnimatePresence mode="wait">
                                {success ? (
                                    <motion.div
                                        key="success"
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="flex items-center justify-center gap-3"
                                    >
                                        <CheckCircle size={20} /> INITIALIZED
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="ready"
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="flex items-center justify-center gap-3"
                                    >
                                        INITIATE PROJECT <ChevronRight size={18} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
