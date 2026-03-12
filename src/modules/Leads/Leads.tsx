import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserPlus, Trash2, Search, X, ChevronDown,
    Calendar, Phone, Mail, Target, ArrowRight, Info, CheckCircle, Plus
} from 'lucide-react';
import { useApp } from '../../hooks/AppContext';
import type { Lead, LeadStatus, JobType } from '../../types';

const STATUS_COLORS: Record<LeadStatus, string> = {
    'New Lead': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Contacted': 'bg-blue-100 text-blue-700 border-blue-200',
    'Quoted': 'bg-violet-100 text-violet-700 border-violet-200',
    'Followed Up': 'bg-amber-100 text-amber-700 border-amber-200',
    'Lost': 'bg-red-100 text-red-600 border-red-200',
};

const JOB_TYPES: JobType[] = ['Wedding', 'Portrait', 'Corporate', 'Family', 'Event', 'Other'];
const STATUSES: LeadStatus[] = ['New Lead', 'Contacted', 'Quoted', 'Followed Up', 'Lost'];

const EMPTY_FORM: Omit<Lead, 'id' | 'createdAt'> = {
    name: '', email: '', contactNumber: '', type: 'Wedding',
    shootDate: '', status: 'New Lead', nextTask: '', notes: '', referredBy: '',
    events: []
};

export function Leads() {
    const { leads, addLead, updateLead, deleteLead } = useApp();
    const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem('leads_welcomed'));
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<LeadStatus | 'All'>('All');
    const [formData, setFormData] = useState(EMPTY_FORM);

    const dismissWelcome = () => {
        localStorage.setItem('leads_welcomed', '1');
        setShowWelcome(false);
    };

    const handleEdit = (lead: Lead) => {
        setFormData({
            name: lead.name, email: lead.email, contactNumber: lead.contactNumber,
            type: lead.type, shootDate: lead.shootDate, status: lead.status,
            nextTask: lead.nextTask, notes: lead.notes, referredBy: lead.referredBy || '',
            events: lead.events || []
        });
        setEditingId(lead.id);
        setShowForm(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            updateLead(editingId, formData);
        } else {
            addLead({
                id: Math.random().toString(36).substr(2, 9).toUpperCase(),
                ...formData,
                createdAt: new Date().toISOString()
            });
        }
        setFormData(EMPTY_FORM);
        setEditingId(null);
        setShowForm(false);
    };

    const filtered = leads.filter(l => {
        const matchSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === 'All' || l.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <AnimatePresence>
                {showWelcome && (
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="relative rounded-2xl border border-primary/20 bg-gradient-to-br from-black to-zinc-900 text-white p-8 overflow-hidden shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                        <button onClick={dismissWelcome} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors">
                            <X size={16} />
                        </button>
                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 bg-white/10 rounded-xl"><Info size={22} /></div>
                            <div>
                                <h2 className="text-xl font-black tracking-tight mb-1">Welcome to Leads Overview</h2>
                                <p className="text-white/70 text-sm leading-relaxed max-w-2xl">
                                    This is where you will find all your Leads. You can manually add new Leads here. Your mission is to convert these Leads into Jobs.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                            {[
                                'A Quote is accepted',
                                'An Invoice is paid',
                                'A Contract is signed',
                                "Manually tick 'Job Accepted'"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2.5 bg-white/5 rounded-xl p-3 border border-white/10">
                                    <CheckCircle size={15} className="text-emerald-400 shrink-0" />
                                    <span className="text-xs font-semibold text-white/80">{item}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={dismissWelcome}
                            className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-xl font-black text-xs tracking-widest uppercase hover:bg-white/90 transition-colors"
                        >
                            Got it <ArrowRight size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-foreground">LEADS</h1>
                    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground mt-1">Prospect Pipeline</p>
                </div>
                <button
                    onClick={() => { setFormData(EMPTY_FORM); setEditingId(null); setShowForm(!showForm); }}
                    className="h-14 px-8 bg-black text-white hover:bg-zinc-800 transition-all rounded-none font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-4"
                >
                    <UserPlus size={18} />
                    <span>Add New Lead</span>
                </button>
            </header>

            {/* Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="card-premium p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center"><Target size={18} /></div>
                                <h3 className="text-lg font-black uppercase tracking-wider">{editingId ? 'Edit Lead' : 'New Lead'}</h3>
                            </div>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Lead Name</label>
                                    <input className="input-field" placeholder="e.g. Anjali & Rohan Wedding" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Type</label>
                                    <div className="relative">
                                        <select className="input-field appearance-none pr-10" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as JobType })}>
                                            {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                                    <input type="email" className="input-field" placeholder="client@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Contact Number</label>
                                    <input type="tel" className="input-field" placeholder="+91 98765 43210" value={formData.contactNumber} onChange={e => setFormData({ ...formData, contactNumber: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Main Shoot Date</label>
                                    <input type="date" className="input-field" value={formData.shootDate} onChange={e => setFormData({ ...formData, shootDate: e.target.value })} />
                                </div>
                                
                                {/* Dynamic Additional Events */}
                                <div className="md:col-span-2 space-y-4">
                                    <div className="flex justify-between items-end border-t border-border/50 pt-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Additional Events & Schedule</label>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, events: [...(formData.events || []), { name: '', date: '' }] })}
                                            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-foreground hover:opacity-60 transition-all"
                                        >
                                            <Plus size={14} /> Add Event
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        <AnimatePresence mode="popLayout">
                                            {formData.events?.map((event, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start p-4 bg-secondary/30 rounded-xl relative group border border-transparent"
                                                >
                                                    <div className="space-y-1">
                                                        <input
                                                            type="text"
                                                            placeholder="Event Name (e.g. Sangeet)"
                                                            className="w-full bg-transparent border-b border-zinc-200/50 py-1.5 text-sm font-bold outline-none focus:border-foreground transition-all"
                                                            value={event.name}
                                                            onChange={e => {
                                                                const newEvents = [...(formData.events || [])];
                                                                newEvents[index] = { ...newEvents[index], name: e.target.value };
                                                                setFormData({ ...formData, events: newEvents });
                                                            }}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <div className="relative flex-1">
                                                            <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground" size={12} />
                                                            <input
                                                                type="date"
                                                                className="w-full bg-transparent border-b border-zinc-200/50 py-1.5 pl-5 text-sm font-bold outline-none focus:border-foreground transition-all"
                                                                value={event.date}
                                                                onChange={e => {
                                                                    const newEvents = [...(formData.events || [])];
                                                                    newEvents[index] = { ...newEvents[index], date: e.target.value };
                                                                    setFormData({ ...formData, events: newEvents });
                                                                }}
                                                                required
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newEvents = (formData.events || []).filter((_, i) => i !== index);
                                                                setFormData({ ...formData, events: newEvents });
                                                            }}
                                                            className="p-1.5 text-zinc-400 hover:text-destructive hover:bg-destructive/10 rounded transition-all shrink-0"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Status</label>
                                    <div className="relative">
                                        <select className="input-field appearance-none pr-10" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as LeadStatus })}>
                                            {STATUSES.map(s => <option key={s}>{s}</option>)}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Next Task</label>
                                    <input className="input-field" placeholder="e.g. Send quote" value={formData.nextTask} onChange={e => setFormData({ ...formData, nextTask: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Referred By</label>
                                    <input className="input-field" placeholder="e.g. Priya Sharma" value={formData.referredBy} onChange={e => setFormData({ ...formData, referredBy: e.target.value })} />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Notes</label>
                                    <textarea className="input-field resize-none" rows={2} placeholder="Any additional notes..." value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                                </div>
                                <div className="md:col-span-2 flex justify-end gap-4 mt-2">
                                    <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-6 py-2.5 rounded-xl font-bold text-muted-foreground hover:bg-secondary transition-colors">Cancel</button>
                                    <button type="submit" className="btn-primary px-12">{editingId ? 'Save Changes' : 'Add Lead'}</button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filter Bar */}
            <div className="flex items-center gap-4 flex-wrap">
                <div className="relative flex-1 min-w-60">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input className="input-field pl-11" placeholder="Search leads..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {(['All', ...STATUSES] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s as any)}
                            className={`px-4 py-2 rounded-xl font-bold text-xs border transition-all ${statusFilter === s ? 'bg-black text-white border-black' : 'border-border text-muted-foreground hover:bg-secondary'}`}
                        >{s}</button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="card-premium !p-0 overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-secondary/50 text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">
                            <th className="px-8 py-6">Lead Created</th>
                            <th className="px-8 py-6">Lead Name</th>
                            <th className="px-8 py-6">Type</th>
                            <th className="px-8 py-6">Main Shoot Date</th>
                            <th className="px-8 py-6">Status</th>
                            <th className="px-8 py-6">Next Task</th>
                            <th className="px-8 py-6 text-right">Ops</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {filtered.length === 0 ? (
                            <tr><td colSpan={7} className="px-8 py-24 text-center">
                                <div className="flex flex-col items-center gap-4 text-muted-foreground/30">
                                    <Target size={48} />
                                    <span className="font-bold text-lg">No leads found</span>
                                    <p className="text-sm max-w-xs">Add your first lead to start converting prospects into jobs.</p>
                                </div>
                            </td></tr>
                        ) : filtered.map((lead, idx) => (
                            <motion.tr
                                key={lead.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.04 }}
                                className="group hover:bg-secondary/30 transition-colors"
                            >
                                <td className="px-8 py-5 text-sm text-muted-foreground font-bold whitespace-nowrap">
                                    {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="px-8 py-5">
                                    <div className="font-black text-foreground">{lead.name}</div>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-[10px] flex items-center gap-1 text-muted-foreground font-bold"><Mail size={10} />{lead.email}</span>
                                        {lead.contactNumber && <span className="text-[10px] flex items-center gap-1 text-muted-foreground font-bold"><Phone size={10} />{lead.contactNumber}</span>}
                                    </div>
                                    {lead.referredBy && <span className="text-[10px] text-muted-foreground font-bold mt-0.5 block">Ref: {lead.referredBy}</span>}
                                </td>
                                <td className="px-8 py-5 text-sm font-bold text-muted-foreground">{lead.type}</td>
                                <td className="px-8 py-5 text-sm font-bold text-muted-foreground whitespace-nowrap">
                                    <div className="flex flex-col gap-1">
                                        {lead.shootDate ? (
                                            <span className="flex items-center gap-1.5 text-foreground"><Calendar size={13} className="text-primary" />{lead.shootDate}</span>
                                        ) : '—'}
                                        {lead.events && lead.events.length > 0 && (
                                            <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded w-fit">
                                                + {lead.events.length} Event{lead.events.length > 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${STATUS_COLORS[lead.status]}`}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-sm font-bold text-muted-foreground max-w-[180px] truncate">{lead.nextTask || '—'}</td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex justify-end gap-1">
                                        <button onClick={() => handleEdit(lead)} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all" title="Edit">
                                            <Target size={16} />
                                        </button>
                                        <button onClick={() => deleteLead(lead.id)} className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length > 0 && (
                    <div className="px-8 py-4 border-t border-border/50 text-xs font-bold text-muted-foreground">
                        Showing {filtered.length} of {leads.length} leads
                    </div>
                )}
            </div>
        </div>
    );
}
