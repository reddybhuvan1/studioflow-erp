import { useState } from 'react';
import { useApp } from '../../hooks/AppContext';
import type { Session, ProjectEvent } from '../../types';
import { UserPlus, Search, Mail, Phone, Calendar, User, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ClientProfile() {
    const { clients, sessions, addClient, updateClient, deleteClient } = useApp();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', contactNumber: '', referredBy: '' });

    const handleEdit = (client: any) => {
        setFormData({ name: client.name, email: client.email, contactNumber: client.contactNumber, referredBy: client.referredBy || '' });
        setEditingId(client.id);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this client? This will not remove their session history records if they exist.')) {
            deleteClient(id);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            updateClient(editingId, formData);
        } else {
            addClient({
                id: Math.random().toString(36).substr(2, 9).toUpperCase(),
                ...formData,
                history: []
            });
        }
        setFormData({ name: '', email: '', contactNumber: '', referredBy: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 max-w-7xl mx-auto">
            <header className="flex justify-between items-end pb-8 border-b border-black/5">
                <div>
                    <h2 className="text-5xl font-light tracking-tighter text-foreground mb-1 uppercase">CLIENT</h2>
                    <h2 className="text-2xl font-black tracking-[0.3em] text-foreground/40 leading-none">RECORDS</h2>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ name: '', email: '', contactNumber: '', referredBy: '' });
                        setShowForm(!showForm);
                    }}
                    className="h-14 px-8 bg-black text-white hover:bg-zinc-800 transition-all rounded-none font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-4"
                >
                    <UserPlus size={18} />
                    <span>Onboard Client</span>
                </button>
            </header>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20 }}
                        className="overflow-hidden"
                    >
                        <div className="card-premium p-8 border-primary/20 bg-primary/5">
                            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                                    {editingId ? <Edit2 size={18} /> : <User size={18} />}
                                </div>
                                {editingId ? 'Update Client Profile' : 'Client Onboarding'}
                            </h3>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Alexander Pierce"
                                        className="input-field"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="alex@studio.com"
                                        className="input-field"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Contact Number</label>
                                    <input
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        className="input-field"
                                        value={formData.contactNumber}
                                        onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Referred By</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Priya Sharma"
                                        className="input-field"
                                        value={formData.referredBy}
                                        onChange={e => setFormData({ ...formData, referredBy: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-3 flex justify-end gap-4 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditingId(null);
                                        }}
                                        className="px-6 py-2.5 rounded-xl font-bold text-muted-foreground hover:bg-secondary transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        {editingId ? 'Save Changes' : 'Generate Profile'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative group max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <input
                    type="text"
                    placeholder="Search clients by name or email..."
                    className="w-full bg-secondary/30 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl py-3 pl-12 pr-4 text-sm outline-none transition-all"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                <AnimatePresence>
                    {filteredClients.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="md:col-span-3 card-premium p-24 text-center bg-secondary/10"
                        >
                            <Search className="mx-auto text-muted-foreground/30 mb-6" size={64} />
                            <h3 className="text-xl font-bold text-muted-foreground">No clients match your search</h3>
                        </motion.div>
                    ) : (
                        filteredClients.map((client, idx) => (
                            <motion.div
                                layout
                                key={client.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="card-premium group hover:border-primary/30"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 bg-black flex items-center justify-center text-white font-black text-2xl group-hover:rotate-[-5deg] transition-transform duration-500">
                                        {client.name.charAt(0)}
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleEdit(client)}
                                            className="p-2 text-muted-foreground hover:text-primary transition-colors"
                                            title="Edit Client"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(client.id)}
                                            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                                            title="Delete Client"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1 mb-8">
                                    <h4 className="font-black text-xl tracking-tight group-hover:text-primary transition-colors">{client.name}</h4>
                                    <p className="text-[10px] font-black text-primary tracking-widest uppercase opacity-60">ID: {client.id}</p>
                                </div>

                                <div className="space-y-3 pt-6 border-t border-border/50">
                                    <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                                        <div className="p-1.5 bg-secondary rounded-lg"><Mail size={14} className="text-primary" /></div>
                                        <span className="truncate">{client.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                                        <div className="p-1.5 bg-secondary rounded-lg"><Phone size={14} className="text-primary" /></div>
                                        {client.contactNumber}
                                    </div>
                                        <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                                            <div className="p-1.5 bg-secondary rounded-lg"><Calendar size={14} className="text-primary" /></div>
                                            {client.history.length || sessions.filter(s => s.clientId === client.id).length} Previous Sessions
                                        </div>
                                        {(() => {
                                            const clientSessions = sessions.filter((s: Session) => s.clientId === client.id);
                                            const totalGB = clientSessions.reduce((acc: number, sess: Session) => {
                                                const sessTotal = (sess.events || []).reduce((sum: number, ev: ProjectEvent) => sum + (ev.dataSizeGB || 0), 0);
                                                return acc + sessTotal;
                                            }, 0);
                                            
                                            // Only render if > 0
                                            if (totalGB > 0) {
                                                return (
                                                    <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                                                        <div className="p-1.5 bg-secondary rounded-lg">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                                                <ellipse cx="12" cy="5" rx="9" ry="3"/>
                                                                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                                                                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                                                            </svg>
                                                        </div>
                                                        {totalGB.toFixed(1)} GB Total Data
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()}
                                        {client.referredBy && (
                                            <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                                                <div className="p-1.5 bg-secondary rounded-lg"><User size={14} className="text-primary" /></div>
                                                <span className="truncate">Ref: {client.referredBy}</span>
                                            </div>
                                        )}
                                </div>

                                <button className="w-full mt-8 py-3 rounded-xl border-2 border-secondary font-black text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 flex items-center justify-center gap-2">
                                    View Full History <ExternalLink size={14} />
                                </button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

