import { useState } from 'react';
import { useApp } from '../../hooks/AppContext';
import { Plus, IndianRupee, Wifi, Zap, Droplets, Wrench, Shield, Hash, Search, Calendar as CalendarIcon, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Expense, ExpenseCategory } from '../../types';

export function Expenses() {
    const { expenses, addExpense, deleteExpense } = useApp();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<Partial<Expense>>({
        category: 'Rent', amount: 0, date: new Date().toISOString().split('T')[0], description: ''
    });

    const categoryIcons: Record<ExpenseCategory, React.ReactNode> = {
        'Rent': <Hash size={16} />,
        'Electricity': <Zap size={16} />,
        'WiFi': <Wifi size={16} />,
        'Water': <Droplets size={16} />,
        'Maintenance': <Wrench size={16} />,
        'Equipment': <Shield size={16} />,
        'Other': <FileText size={16} />
    };

    const handleAddExpense = (e: React.FormEvent) => {
        e.preventDefault();
        addExpense({
            ...formData,
            id: `EXP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
        } as Expense);
        setShowForm(false);
        setFormData({ category: 'Rent', amount: 0, date: new Date().toISOString().split('T')[0], description: '' });
    };

    const currentMonthExpenses = expenses
        .filter(e => new Date(e.date).getMonth() === new Date().getMonth())
        .reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-12 pb-16 md:pb-24">
            <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 pb-4 md:pb-8 border-b border-black/5">
                <div>
                    <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-foreground mb-1 uppercase">MAINTENANCE</h2>
                    <h2 className="text-xl md:text-2xl font-black tracking-[0.3em] text-foreground/40 leading-none">STUDIO OVERHEADS</h2>
                </div>
                <button onClick={() => setShowForm(true)} className="w-full sm:w-auto justify-center sm:justify-start flex items-center gap-2 px-8 py-4 bg-black text-white hover:bg-black/80 font-black uppercase tracking-widest text-[10px] transition-all shrink-0">
                    <Plus size={16} /> Record Expense
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-premium p-8 bg-black text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">This Month's Overhead</div>
                    <div className="flex justify-between items-end relative z-10">
                        <div className="text-4xl font-black tracking-tighter">
                            ₹{currentMonthExpenses.toLocaleString('en-IN')}
                        </div>
                        <div className="text-primary/80"><IndianRupee size={24} /></div>
                    </div>
                </div>

                <div className="card-premium p-8 col-span-2 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                        <Zap size={24} className="text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black tracking-tight mb-1">Operational Analytics</h3>
                        <p className="text-sm font-medium text-muted-foreground">Monitor your fixed and variable costs. Keeping overheads lean maximizes your studio's net profit margins.</p>
                    </div>
                </div>
            </div>

            <div className="card-premium overflow-hidden !p-0">
                <div className="p-4 md:p-6 bg-secondary/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50">
                    <h3 className="text-sm font-black uppercase tracking-widest">Expense Ledger</h3>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                        <input type="text" placeholder="Search records..." className="w-full bg-white border border-border/50 rounded py-2 pl-9 pr-4 text-xs font-bold outline-none focus:border-primary" />
                    </div>
                </div>
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left min-w-[600px]">
                    <thead>
                        <tr className="text-[9px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4 text-right">Amount (₹)</th>
                            <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 text-sm">
                        {expenses.length === 0 ? (
                            <tr><td colSpan={5} className="py-12 text-center text-muted-foreground font-bold border-none">No expenses recorded yet.</td></tr>
                        ) : (
                            // Sort by date descending
                            [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(expense => (
                                <tr key={expense.id} className="group hover:bg-secondary/10 transition-colors">
                                    <td className="px-6 py-4 font-bold text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon size={14} /> {new Date(expense.date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-primary">
                                                {categoryIcons[expense.category]}
                                            </div>
                                            <span className="font-black">{expense.category}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium max-w-md truncate">{expense.description || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-black text-foreground">
                                        {expense.amount.toLocaleString('en-IN')}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => deleteExpense(expense.id)}
                                            className="text-[10px] font-black uppercase tracking-widest text-destructive/50 hover:text-destructive transition-colors p-2"
                                            title="Remove Entry"
                                        >
                                            Void
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                </div>
            </div>

            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white p-10 max-w-md w-full shadow-2xl relative border border-border/50">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black text-xl">
                                    ₹
                                </div>
                                <div>
                                    <h3 className="text-2xl font-light tracking-tighter uppercase leading-none">Record Entry</h3>
                                    <p className="text-[9px] font-black tracking-widest text-muted-foreground uppercase mt-1">Maintenance & Overheads</p>
                                </div>
                            </div>
                            
                            <form onSubmit={handleAddExpense} className="space-y-5 flex flex-col">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Category</label>
                                    <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value as ExpenseCategory })} className="w-full border-b-2 border-border/50 py-2 outline-none focus:border-black font-black bg-transparent transition-colors">
                                        <option value="Rent">Rent & Lease</option>
                                        <option value="Electricity">Electricity</option>
                                        <option value="WiFi">Internet & Phone</option>
                                        <option value="Water">Water & Utilities</option>
                                        <option value="Maintenance">Repairs & Maintenance</option>
                                        <option value="Equipment">Equipment Costs</option>
                                        <option value="Other">Other Expenses</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Amount (₹)</label>
                                        <input type="number" min="0" required value={formData.amount || ''} onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })} className="w-full border-b-2 border-border/50 py-2 outline-none focus:border-black font-black transition-colors" placeholder="0" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Date</label>
                                        <input type="date" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full border-b-2 border-border/50 py-2 outline-none focus:border-black font-black transition-colors bg-transparent" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Description / Notes</label>
                                    <input type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border-b-2 border-border/50 py-2 outline-none focus:border-black font-bold transition-colors" placeholder="e.g. November Office Rent..." />
                                </div>
                                
                                <div className="flex gap-4 pt-8">
                                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary transition-colors">Cancel</button>
                                    <button type="submit" className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest bg-black text-white hover:bg-black/80 transition-colors">Log Expense</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
