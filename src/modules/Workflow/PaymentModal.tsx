import { useState } from 'react';
import { useApp } from '../../hooks/AppContext';
import { X, CreditCard, Calendar, Trash2 } from 'lucide-react';
import type { Session } from '../../types';
import { motion } from 'framer-motion';

export function PaymentModal({ session, onClose }: { session: Session, onClose: () => void }) {
    const { addClientPayment, deleteClientPayment } = useApp();
    const payments = session.payments || [];
    
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [method, setMethod] = useState('UPI');
    const [notes, setNotes] = useState('');

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const balance = session.grandTotal - totalPaid;

    const handleAddPayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || isNaN(Number(amount))) return;
        
        addClientPayment({
            id: Math.random().toString(36).substr(2, 9).toUpperCase(),
            sessionId: session.id,
            amount: Number(amount),
            date,
            method,
            notes
        });
        
        setAmount('');
        setNotes('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                <div className="p-8 border-b border-black/5 flex justify-between items-center bg-zinc-50/50">
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight">Payment Ledger</h3>
                        <p className="text-sm font-bold text-muted-foreground mt-1 tracking-wide">Manage payments for this session</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <X size={24} className="text-muted-foreground" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl bg-secondary/30 border border-secondary">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Grand Total</p>
                            <p className="text-2xl font-black">₹{session.grandTotal.toLocaleString()}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/70 mb-1">Total Paid</p>
                            <p className="text-2xl font-black text-emerald-600">₹{totalPaid.toLocaleString()}</p>
                        </div>
                        <div className={`p-4 rounded-2xl border ${balance > 0 ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-secondary/30 border-secondary text-foreground'}`}>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Balance</p>
                            <p className="text-2xl font-black">₹{Math.max(0, balance).toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Payment History */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 select-none">Transaction History</h4>
                        {payments.length === 0 ? (
                            <div className="text-center py-8 bg-secondary/20 rounded-2xl border border-dashed border-secondary">
                                <p className="text-sm font-bold text-muted-foreground">No payments recorded yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {payments.map(payment => (
                                    <div key={payment.id} className="flex items-center justify-between p-4 rounded-xl border border-black/5 hover:border-black/10 transition-colors bg-white group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                <CreditCard size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg leading-none mb-1">₹{payment.amount.toLocaleString()}</p>
                                                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(payment.date).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span>{payment.method}</span>
                                                    {payment.notes && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="truncate max-w-[150px]">{payment.notes}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => { if(window.confirm('Delete this payment record?')) deleteClientPayment(payment.id) }} 
                                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Add Payment Form */}
                <div className="p-8 bg-zinc-50/80 border-t border-black/5">
                    <form onSubmit={handleAddPayment} className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Amount</label>
                            <input type="number" required min="1" max={Math.max(1, balance)} step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="input-field bg-white" placeholder="0.00" />
                        </div>
                        <div className="flex-1 space-y-2 max-w-[150px]">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Date</label>
                            <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="input-field bg-white" />
                        </div>
                        <div className="flex-1 space-y-2 max-w-[150px]">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Method</label>
                            <select value={method} onChange={e => setMethod(e.target.value)} className="input-field bg-white">
                                <option>UPI</option>
                                <option>Bank Transfer</option>
                                <option>Cash</option>
                                <option>Card</option>
                            </select>
                        </div>
                        <button type="submit" disabled={balance <= 0 && payments.length > 0} className={`h-12 px-6 rounded-xl font-bold transition-all flex items-center justify-center disabled:opacity-50 ${balance <= 0 && payments.length > 0 ? 'bg-secondary text-muted-foreground' : 'bg-black text-white hover:bg-black/80'}`}>
                            Log Payment
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
