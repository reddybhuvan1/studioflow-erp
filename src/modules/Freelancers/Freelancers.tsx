import { useState } from 'react';
import { useApp } from '../../hooks/AppContext';
import { Plus, IndianRupee, Phone, Building, UserPlus, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Freelancer, FreelancerPayment } from '../../types';

export function Freelancers() {
    const { freelancers, addFreelancer, freelancerPayments, addFreelancerPayment, updateFreelancerPayment, sessions } = useApp();
    const [view, setView] = useState<'Directory' | 'Payments'>('Directory');
    
    // Freelancer form
    const [showFreelancerForm, setShowFreelancerForm] = useState(false);
    const [formData, setFormData] = useState<Partial<Freelancer>>({
        name: '', role: '', contactNumber: '', accountNumber: '', ifsc: '', branchName: ''
    });

    // Payment Form
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [paymentData, setPaymentData] = useState<Partial<FreelancerPayment>>({
        freelancerId: '', sessionId: '', eventName: '', eventDate: '', amount: 0, status: 'Pending'
    });

    const activeSessions = sessions.filter(s => s.stage !== 'CLOSED');
    const selectedSession = activeSessions.find(s => s.id === paymentData.sessionId);

    const handleAddFreelancer = (e: React.FormEvent) => {
        e.preventDefault();
        addFreelancer({
            ...formData,
            id: `F-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
        } as Freelancer);
        setShowFreelancerForm(false);
        setFormData({ name: '', role: '', contactNumber: '', accountNumber: '', ifsc: '', branchName: '' });
    };

    const handleAddPayment = (e: React.FormEvent) => {
        e.preventDefault();
        addFreelancerPayment({
            ...paymentData,
            id: `PAY-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            paymentDate: paymentData.status === 'Paid' ? new Date().toISOString() : undefined
        } as FreelancerPayment);
        setShowPaymentForm(false);
        setPaymentData({ freelancerId: '', sessionId: '', eventName: '', eventDate: '', amount: 0, status: 'Pending' });
    };

    const togglePaymentStatus = (id: string, currentStatus: string) => {
        updateFreelancerPayment(id, {
            status: currentStatus === 'Pending' ? 'Paid' : 'Pending',
            paymentDate: currentStatus === 'Pending' ? new Date().toISOString() : undefined
        });
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-12 pb-16 md:pb-24">
            <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 pb-4 md:pb-8 border-b border-black/5">
                <div>
                    <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-foreground mb-1 uppercase">FREELANCERS</h2>
                    <h2 className="text-xl md:text-2xl font-black tracking-[0.3em] text-foreground/40 leading-none">NETWORK & PAYMENTS</h2>
                </div>
                <div className="flex bg-secondary/30 p-1 rounded-lg self-start sm:self-auto w-full sm:w-auto">
                    <button 
                        onClick={() => setView('Directory')}
                        className={`flex-1 sm:flex-none px-4 md:px-6 py-2 rounded-md text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${view === 'Directory' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-black/5'}`}
                    >
                        Directory
                    </button>
                    <button 
                        onClick={() => setView('Payments')}
                        className={`flex-1 sm:flex-none px-4 md:px-6 py-2 rounded-md text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${view === 'Payments' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-black/5'}`}
                    >
                        Event Payments
                    </button>
                </div>
            </header>

            {view === 'Directory' && (
                <div className="space-y-6">
                    <div className="flex justify-start sm:justify-end">
                        <button onClick={() => setShowFreelancerForm(true)} className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 px-6 py-3 bg-black text-white hover:bg-black/80 font-bold uppercase tracking-widest text-[10px] transition-all">
                            <UserPlus size={16} /> Add Freelancer
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {freelancers.map(f => (
                            <div key={f.id} className="card-premium p-6 group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-black text-lg group-hover:text-primary transition-colors">{f.name}</h3>
                                        <div className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded inline-block mt-1">
                                            {f.role}
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center">
                                        <Camera size={18} className="text-muted-foreground" />
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-3 text-muted-foreground font-medium">
                                        <Phone size={14} /> {f.contactNumber}
                                    </div>
                                    {f.accountNumber && (
                                        <div className="flex items-center gap-3 text-muted-foreground font-medium pt-2 border-t border-border/50">
                                            <Building size={14} /> 
                                            <span className="truncate">{f.accountNumber} <span className="opacity-50">({f.ifsc})</span></span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {freelancers.length === 0 && (
                            <div className="col-span-full py-12 text-center text-muted-foreground text-sm font-bold border-2 border-dashed border-border/50 rounded-xl">
                                No freelancers in directory.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {view === 'Payments' && (
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 bg-secondary/10 p-4 md:p-6 border border-border/50">
                        <div className="flex gap-6 md:gap-12 w-full sm:w-auto justify-between sm:justify-start">
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Outstanding</div>
                                <div className="text-2xl md:text-3xl font-black text-destructive">
                                    ₹{freelancerPayments.filter(p => p.status === 'Pending').reduce((a,c) => a+c.amount, 0).toLocaleString('en-IN')}
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Paid out</div>
                                <div className="text-2xl md:text-3xl font-black text-emerald-600">
                                    ₹{freelancerPayments.filter(p => p.status === 'Paid').reduce((a,c) => a+c.amount, 0).toLocaleString('en-IN')}
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setShowPaymentForm(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-black text-white hover:bg-black/80 font-bold uppercase tracking-widest text-[10px] transition-all shrink-0">
                            <Plus size={16} /> Assign Payment
                        </button>
                    </div>

                    <div className="card-premium overflow-x-auto !p-0">
                        <table className="w-full text-left min-w-[700px]">
                            <thead className="bg-secondary/30">
                                <tr className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                    <th className="px-6 py-4">Freelancer</th>
                                    <th className="px-6 py-4">Event</th>
                                    <th className="px-6 py-4 text-right">Amount (₹)</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50 text-sm">
                                {freelancerPayments.length === 0 ? (
                                    <tr><td colSpan={5} className="py-12 text-center text-muted-foreground font-bold border-none">No payments recorded.</td></tr>
                                ) : (
                                    freelancerPayments.map(payment => {
                                        const freelancer = freelancers.find(f => f.id === payment.freelancerId);
                                        const isPaid = payment.status === 'Paid';
                                        return (
                                            <tr key={payment.id} className="group hover:bg-secondary/10 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-black">{freelancer?.name || 'Unknown'}</div>
                                                    <div className="text-[10px] font-bold text-muted-foreground">{freelancer?.role}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold">{payment.eventName}</div>
                                                    <div className="text-[10px] font-bold text-muted-foreground">
                                                        {new Date(payment.eventDate).toLocaleDateString()} • {payment.sessionId}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right font-black">
                                                    {payment.amount.toLocaleString('en-IN')}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded border ${isPaid ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-destructive/10 text-destructive border-destructive/20'}`}>
                                                        {payment.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button 
                                                        onClick={() => togglePaymentStatus(payment.id, payment.status)}
                                                        className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 border transition-all ${isPaid ? 'border-border/50 text-muted-foreground hover:bg-secondary' : 'border-black bg-black text-white hover:bg-black/80'}`}
                                                    >
                                                        {isPaid ? 'Mark Pending' : 'Mark Paid'}
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Freelancer Form Modal */}
            <AnimatePresence>
                {showFreelancerForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white p-8 max-w-md w-full shadow-2xl relative">
                            <h3 className="text-xl font-black mb-6 uppercase tracking-widest">Add Freelancer</h3>
                            <form onSubmit={handleAddFreelancer} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Name</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border-b border-border py-2 outline-none focus:border-black font-bold" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Specialty / Role</label>
                                    <select required value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full border-b border-border py-2 outline-none focus:border-black font-bold bg-transparent">
                                        <option value="">Select Role...</option>
                                        <option value="Traditional Photographer">Traditional Photographer</option>
                                        <option value="Candid Photographer">Candid Photographer</option>
                                        <option value="Videographer">Videographer</option>
                                        <option value="Drone Operator">Drone Operator</option>
                                        <option value="Assistant">Assistant</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contact Number</label>
                                    <input type="text" required value={formData.contactNumber} onChange={e => setFormData({ ...formData, contactNumber: e.target.value })} className="w-full border-b border-border py-2 outline-none focus:border-black font-bold" />
                                </div>
                                <div className="pt-4 space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-secondary/50 p-2">Bank Details (Optional)</h4>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Account Number</label>
                                        <input type="text" value={formData.accountNumber} onChange={e => setFormData({ ...formData, accountNumber: e.target.value })} className="w-full border-b border-border py-2 outline-none focus:border-black font-bold" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">IFSC Code</label>
                                            <input type="text" value={formData.ifsc} onChange={e => setFormData({ ...formData, ifsc: e.target.value })} className="w-full border-b border-border py-2 outline-none focus:border-black font-bold" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Branch</label>
                                            <input type="text" value={formData.branchName} onChange={e => setFormData({ ...formData, branchName: e.target.value })} className="w-full border-b border-border py-2 outline-none focus:border-black font-bold" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-6">
                                    <button type="button" onClick={() => setShowFreelancerForm(false)} className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary transition-colors">Cancel</button>
                                    <button type="submit" className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest bg-black text-white hover:bg-black/80 transition-colors">Save</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Payment Assignment Modal */}
            <AnimatePresence>
                {showPaymentForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white p-8 max-w-md w-full shadow-2xl relative">
                            <h3 className="text-xl font-black mb-6 uppercase tracking-widest">Assign Event Payment</h3>
                            <form onSubmit={handleAddPayment} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Freelancer</label>
                                    <select required value={paymentData.freelancerId} onChange={e => setPaymentData({ ...paymentData, freelancerId: e.target.value })} className="w-full border-b border-border py-2 outline-none focus:border-black font-bold bg-transparent">
                                        <option value="">Select Freelancer...</option>
                                        {freelancers.map(f => (
                                            <option key={f.id} value={f.id}>{f.name} - {f.role}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Project (Session)</label>
                                    <select required value={paymentData.sessionId} onChange={e => setPaymentData({ ...paymentData, sessionId: e.target.value, eventName: '', eventDate: '' })} className="w-full border-b border-border py-2 outline-none focus:border-black font-bold bg-transparent">
                                        <option value="">Select Project...</option>
                                        {activeSessions.map(s => (
                                            <option key={s.id} value={s.id}>{s.id}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                {selectedSession && (
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Project Event</label>
                                        <select required value={paymentData.eventName} onChange={e => {
                                            const ev = selectedSession.events.find(x => x.name === e.target.value);
                                            setPaymentData({ ...paymentData, eventName: e.target.value, eventDate: ev?.date || '' });
                                        }} className="w-full border-b border-border py-2 outline-none focus:border-black font-bold bg-transparent">
                                            <option value="">Select Event...</option>
                                            {selectedSession.events.map((ev, i) => (
                                                <option key={i} value={ev.name}>{ev.name} ({ev.date})</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment Amount (₹)</label>
                                    <div className="relative">
                                        <IndianRupee size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input type="number" min="0" required value={paymentData.amount || ''} onChange={e => setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) })} className="w-full border-b border-border py-2 pl-6 outline-none focus:border-black font-bold" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</label>
                                    <select required value={paymentData.status} onChange={e => setPaymentData({ ...paymentData, status: e.target.value as 'Pending' | 'Paid' })} className="w-full border-b border-border py-2 outline-none focus:border-black font-bold bg-transparent">
                                        <option value="Pending">Pending</option>
                                        <option value="Paid">Paid Out</option>
                                    </select>
                                </div>
                                <div className="flex gap-4 pt-6">
                                    <button type="button" onClick={() => setShowPaymentForm(false)} className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary transition-colors">Cancel</button>
                                    <button type="submit" className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest bg-black text-white hover:bg-black/80 transition-colors">Assign payment</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
