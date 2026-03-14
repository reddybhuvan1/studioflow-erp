import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase, Trash2, Search, ChevronDown,
    Calendar, Clock, CheckCircle2, ArrowRight, BarChart3, Filter
} from 'lucide-react';
import { useApp } from '../../hooks/AppContext';
import type { Job, JobType } from '../../types';

const JOB_TYPES: JobType[] = ['Wedding', 'Portrait', 'Corporate', 'Family', 'Event', 'Other'];

const EMPTY_FORM = {
    name: '', type: 'Wedding' as JobType, shootDate: '',
    workflowProgress: 0, nextTask: '', notes: ''
};

export function Jobs() {
    const { jobs, addJob, updateJob, deleteJob } = useApp();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<JobType | 'All'>('All');
    const [formData, setFormData] = useState(EMPTY_FORM);

    const handleEdit = (job: Job) => {
        setFormData({
            name: job.name, type: job.type, shootDate: job.shootDate,
            workflowProgress: job.workflowProgress, nextTask: job.nextTask, notes: job.notes
        });
        setEditingId(job.id);
        setShowForm(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            updateJob(editingId, formData);
        } else {
            addJob({
                id: Math.random().toString(36).substr(2, 9).toUpperCase(),
                ...formData,
                createdAt: new Date().toISOString()
            });
        }
        setFormData(EMPTY_FORM);
        setEditingId(null);
        setShowForm(false);
    };

    const filtered = jobs.filter(j => {
        const matchSearch = j.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = typeFilter === 'All' || j.type === typeFilter;
        return matchSearch && matchType;
    });

    const averageProgress = jobs.length > 0
        ? Math.round(jobs.reduce((acc, j) => acc + j.workflowProgress, 0) / jobs.length)
        : 0;

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-premium p-6 bg-black text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-white/10 rounded-lg"><Briefcase size={20} /></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Active Jobs</span>
                    </div>
                    <div className="text-4xl font-black mb-1">{jobs.length}</div>
                    <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Ongoing Productions</div>
                </div>
                <div className="card-premium p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-secondary rounded-lg text-primary"><BarChart3 size={20} /></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Average Progress</span>
                    </div>
                    <div className="text-4xl font-black mb-1 text-foreground">{averageProgress}%</div>
                    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mt-3">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${averageProgress}%` }}
                            className="h-full bg-primary"
                        />
                    </div>
                </div>
                <div className="card-premium p-6 border-emerald-500/20 bg-emerald-500/5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600"><CheckCircle2 size={20} /></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60">Upcoming Deliveries</span>
                    </div>
                    <div className="text-4xl font-black mb-1 text-emerald-700">
                        {jobs.filter(j => new Date(j.shootDate) > new Date()).length}
                    </div>
                    <div className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest whitespace-nowrap">Scheduled this Month</div>
                </div>
            </div>

            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-foreground">JOBS</h1>
                    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground mt-1">Active Productions</p>
                </div>
                <button
                    onClick={() => { setFormData(EMPTY_FORM); setEditingId(null); setShowForm(!showForm); }}
                    className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 bg-black text-white hover:bg-zinc-800 transition-all rounded-none font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] flex items-center justify-center sm:justify-start gap-3 md:gap-4 shrink-0"
                >
                    <Briefcase size={18} />
                    <span>Create New Job</span>
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
                        <div className="card-premium p-4 md:p-8">
                            <div className="flex items-center gap-3 mb-6 md:mb-8">
                                <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center"><Briefcase size={18} /></div>
                                <h3 className="text-lg font-black uppercase tracking-wider">{editingId ? 'Edit Job' : 'New Job'}</h3>
                            </div>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Job Name</label>
                                    <input className="input-field" placeholder="e.g. Sharma Wedding" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
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
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Shoot Date</label>
                                    <input type="date" className="input-field" value={formData.shootDate} onChange={e => setFormData({ ...formData, shootDate: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Workflow Progress ({formData.workflowProgress}%)</label>
                                    <input type="range" className="w-full accent-black h-10" min="0" max="100" step="5" value={formData.workflowProgress} onChange={e => setFormData({ ...formData, workflowProgress: parseInt(e.target.value) })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Next Task</label>
                                    <input className="input-field" placeholder="e.g. Finalise shot list" value={formData.nextTask} onChange={e => setFormData({ ...formData, nextTask: e.target.value })} />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Internal Notes</label>
                                    <textarea className="input-field resize-none" rows={2} placeholder="Any specific requirements for this job..." value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                                </div>
                                <div className="md:col-span-2 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 mt-2">
                                    <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-muted-foreground hover:bg-secondary transition-colors">Cancel</button>
                                    <button type="submit" className="w-full sm:w-auto btn-primary sm:px-12">{editingId ? 'Update Job' : 'Create Job'}</button>
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
                    <input className="input-field pl-11" placeholder="Search jobs..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <div className="relative">
                        <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <select
                            className="h-11 pl-10 pr-10 bg-secondary/50 border-none rounded-xl text-xs font-bold text-muted-foreground appearance-none min-w-[140px]"
                            value={typeFilter}
                            onChange={e => setTypeFilter(e.target.value as any)}
                        >
                            <option value="All">All Types</option>
                            {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Job Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.length === 0 ? (
                    <div className="col-span-full card-premium py-24 text-center">
                        <div className="flex flex-col items-center gap-4 text-muted-foreground/30">
                            <Briefcase size={64} strokeWidth={1} />
                            <span className="font-bold text-xl">No active jobs found</span>
                            <p className="text-sm max-w-sm">Create a new job to start tracking shoot dates and workflow progress.</p>
                        </div>
                    </div>
                ) : filtered.map((job, idx) => (
                    <motion.div
                        key={job.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group card-premium hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex gap-1">
                                <button onClick={() => handleEdit(job)} className="p-2 bg-white/80 hover:bg-white text-zinc-600 rounded-lg shadow-sm border border-zinc-100 transition-all"><CLOCK size={16} /></button>
                                <button onClick={() => deleteJob(job.id)} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg shadow-sm border border-red-100 transition-all"><Trash2 size={16} /></button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/5 px-2.5 py-1 rounded-full">{job.type}</span>
                            <h4 className="text-xl font-black mt-3 group-hover:text-primary transition-colors leading-tight">{job.name}</h4>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                                <Calendar size={14} className="text-zinc-400" />
                                <span>{new Date(job.shootDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                                <Clock size={14} className="text-zinc-400" />
                                <span className="text-primary">{job.nextTask || 'Workflow Active'}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="text-muted-foreground">Production Stage</span>
                                <span className="text-primary">{job.workflowProgress}%</span>
                            </div>
                            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${job.workflowProgress}%` }}
                                    className={`h-full transition-all duration-1000 ${job.workflowProgress === 100 ? 'bg-emerald-500' : 'bg-primary'}`}
                                />
                            </div>
                        </div>

                        <button
                            onClick={() => handleEdit(job)}
                            className="w-full mt-6 py-3 rounded-xl bg-secondary text-foreground font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            Open Workflow <ArrowRight size={14} />
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// Fixed Clock import issue (from lucide-react, some tools mis-import)
const CLOCK = Clock;
