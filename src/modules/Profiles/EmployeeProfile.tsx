import { useState } from 'react';
import { useApp } from '../../hooks/AppContext';
import { UserPlus, Briefcase, Calendar, DollarSign, Landmark, Edit2, Trash2, UserCheck, Key, RefreshCw, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function EmployeeProfile() {
    const { employees, addEmployee, updateEmployee, deleteEmployee, user, generateCredentials, resetCredentials } = useApp();
    const isAdmin = user?.role === 'admin';
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        accountNumber: '',
        ifsc: '',
        branchName: '',
        joiningDate: new Date().toISOString().split('T')[0],
        salary: '',
        currentSalary: '',
        permissions: [] as string[]
    });
    const [credentialsResult, setCredentialsResult] = useState<{ email: string; password: string } | null>(null);
    const [showCredentialsModal, setShowCredentialsModal] = useState(false);

    const handleEdit = (emp: any) => {
        setFormData({
            name: emp.name,
            role: emp.role,
            accountNumber: emp.accountNumber,
            ifsc: emp.ifsc,
            branchName: emp.branchName,
            joiningDate: emp.joiningDate,
            salary: emp.salary,
            currentSalary: emp.currentSalary,
            permissions: emp.permissions || []
        });
        setEditingId(emp.id);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to remove this staff member from the directory?')) {
            deleteEmployee(id);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            updateEmployee(editingId, formData);
        } else {
            addEmployee({
                id: `STF-${Math.floor(10000 + Math.random() * 90000)}`,
                ...formData
            });
        }
        setFormData({
            name: '',
            role: '',
            accountNumber: '',
            ifsc: '',
            branchName: '',
            joiningDate: new Date().toISOString().split('T')[0],
            salary: '',
            currentSalary: '',
            permissions: []
        });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="space-y-12 max-w-7xl mx-auto">
            <header className="flex justify-between items-end pb-8 border-b border-black/5">
                <div>
                    <h2 className="text-5xl font-light tracking-tighter text-foreground mb-1 uppercase">TALENT</h2>
                    <h2 className="text-2xl font-black tracking-[0.3em] text-foreground/40 leading-none">DIRECTORY</h2>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({
                            name: '',
                            role: '',
                            accountNumber: '',
                            ifsc: '',
                            branchName: '',
                            joiningDate: new Date().toISOString().split('T')[0],
                            salary: '',
                            currentSalary: '',
                            permissions: []
                        });
                        setShowForm(!showForm);
                    }}
                    className="h-14 px-8 bg-black text-white hover:bg-zinc-800 transition-all rounded-none font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-4"
                >
                    <UserPlus size={18} />
                    <span>Onboard Talent</span>
                </button>
            </header>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <div className="card-premium p-8 border-primary/20 bg-primary/5">
                            <h3 className="text-xl font-black mb-8 flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                                    {editingId ? <Edit2 size={18} /> : <UserCheck size={18} />}
                                </div>
                                {editingId ? 'Edit Staff Profile' : 'Onboard Studio Talent'}
                            </h3>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Role / Designation</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Bank A/C No.</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 1234567890"
                                        className="input-field"
                                        value={formData.accountNumber}
                                        onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">IFSC Code</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. SBIN0001234"
                                        className="input-field"
                                        value={formData.ifsc}
                                        onChange={e => setFormData({ ...formData, ifsc: e.target.value.toUpperCase() })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Branch Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. MG Road Branch"
                                        className="input-field"
                                        value={formData.branchName}
                                        onChange={e => setFormData({ ...formData, branchName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Joining Date</label>
                                    <input
                                        type="date"
                                        className="input-field"
                                        value={formData.joiningDate}
                                        onChange={e => setFormData({ ...formData, joiningDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Salary at Joining</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. ₹45,000/month"
                                        className="input-field"
                                        value={formData.salary}
                                        onChange={e => setFormData({ ...formData, salary: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Current Salary</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. ₹52,000/month"
                                        className="input-field"
                                        value={formData.currentSalary}
                                        onChange={e => setFormData({ ...formData, currentSalary: e.target.value })}
                                        required
                                    />
                                </div>
                                
                                <div className="md:col-span-2 flex justify-end gap-4 mt-4">
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
                                    <button type="submit" className="btn-primary px-12">
                                        {editingId ? 'Save Staff Changes' : 'Commit Onboarding'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="card-premium !p-0 overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-secondary/50 text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">
                            <th className="px-8 py-6">Staff Member</th>
                            <th className="px-8 py-6">Responsibility</th>
                            <th className="px-8 py-6">Tenure Start</th>
                            <th className="px-8 py-6">Salary at Joining</th>
                            <th className="px-8 py-6">Current Salary</th>
                            <th className="px-8 py-6 text-right">Ops</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {employees.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-8 py-24 text-center">
                                    <div className="flex flex-col items-center gap-4 text-muted-foreground/30">
                                        <Briefcase size={48} />
                                        <span className="font-bold text-lg">No staff members assigned</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            employees.map((emp, idx) => (
                                <motion.tr
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={emp.id}
                                    className="hover:bg-primary/[0.02] transition-colors group"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black text-xs transition-all">
                                                {emp.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black text-foreground group-hover:text-primary transition-colors">{emp.name}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">ID: {emp.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm">
                                        <div className="flex items-center gap-2 font-bold text-muted-foreground">
                                            <Briefcase size={14} className="text-primary" />
                                            {emp.role}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-bold text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-primary" />
                                            {emp.joiningDate}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold text-muted-foreground flex items-center gap-1.5 text-sm"><DollarSign size={13} />{emp.salary}</span>
                                            <span className="text-[10px] flex items-center gap-1.5 font-bold text-muted-foreground uppercase tracking-wider">
                                                <Landmark size={12} /> {emp.accountNumber}
                                            </span>
                                            <span className="text-[10px] flex items-center gap-1.5 font-bold text-muted-foreground uppercase tracking-wider">
                                                <Landmark size={12} /> {emp.ifsc} · {emp.branchName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-black text-foreground flex items-center gap-1.5"><DollarSign size={14} className="text-primary" />{emp.currentSalary}</span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-1">
                                            {isAdmin && (
                                                <>
                                                    {emp.email ? (
                                                        <button
                                                            onClick={() => {
                                                                const pass = resetCredentials(emp.id);
                                                                setCredentialsResult({ email: emp.email!, password: pass });
                                                                setShowCredentialsModal(true);
                                                            }}
                                                            className="p-2 text-muted-foreground hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
                                                            title="Reset Credentials"
                                                        >
                                                            <RefreshCw size={18} />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                const res = generateCredentials(emp.id);
                                                                setCredentialsResult(res);
                                                                setShowCredentialsModal(true);
                                                            }}
                                                            className="p-2 text-muted-foreground hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                                                            title="Generate Credentials"
                                                        >
                                                            <Key size={18} />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleEdit(emp)}
                                                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                                title="Edit Staff"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(emp.id)}
                                                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                                                title="Delete Staff"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-12 border border-black/5 bg-black text-white flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-white/10 flex items-center justify-center text-white">
                        <UserCheck size={40} />
                    </div>
                    <div>
                        <h4 className="text-2xl font-light tracking-tighter uppercase mb-1">ACCESS CONTROL</h4>
                        <h4 className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">PERMISSIONS & SECURITY</h4>
                    </div>
                </div>
                <button className="h-12 px-8 border border-white/20 text-white font-black text-[9px] tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all">
                    CONFIGURE
                </button>
            </div>

            <AnimatePresence>
                {showCredentialsModal && credentialsResult && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-md bg-zinc-950 border border-white/10 p-10 relative shadow-2xl"
                        >
                            <button
                                onClick={() => setShowCredentialsModal(false)}
                                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-white/5 mx-auto mb-6 flex items-center justify-center text-emerald-400">
                                    <ShieldCheck size={32} />
                                </div>
                                <h3 className="text-2xl font-light tracking-tighter text-white uppercase mb-2">ACCESS GENERATED</h3>
                                <p className="text-[9px] font-black tracking-[0.3em] text-zinc-500 uppercase">Secure credentials established</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black tracking-widest text-zinc-600 uppercase">Login ID</label>
                                    <div className="bg-white/5 border border-white/5 px-4 py-3 font-mono text-sm text-white select-all">
                                        {credentialsResult.email}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black tracking-widest text-zinc-600 uppercase">Secret Key</label>
                                    <div className="bg-white/5 border border-white/5 px-4 py-3 font-mono text-xl font-black text-white tracking-widest select-all">
                                        {credentialsResult.password}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 p-4 bg-amber-500/10 border-l-2 border-amber-500 text-[10px] font-black uppercase tracking-widest text-amber-200/70 leading-relaxed">
                                IMPORTANT: Share these credentials securely. They will not be displayed again in full.
                            </div>

                            <button
                                onClick={() => setShowCredentialsModal(false)}
                                className="w-full mt-10 py-5 bg-white text-black font-black text-[10px] tracking-[0.4em] uppercase hover:bg-zinc-200 transition-colors"
                            >
                                Acknowledge & Close
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

