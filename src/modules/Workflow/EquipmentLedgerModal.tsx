import { useState } from 'react';
import { useApp } from '../../hooks/AppContext';
import { X, HardDrive, Calendar, Trash2, CheckCircle2, Circle } from 'lucide-react';
import type { Session } from '../../types';
import { motion } from 'framer-motion';

export function EquipmentLedgerModal({ session, onClose }: { session: Session, onClose: () => void }) {
    const { addClientEquipment, updateClientEquipment, deleteClientEquipment } = useApp();
    const equipmentList = session.clientEquipment || [];
    
    const [itemName, setItemName] = useState('');
    const [receivedDate, setReceivedDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');

    const handleAddEquipment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemName.trim()) return;
        
        addClientEquipment({
            id: Math.random().toString(36).substr(2, 9).toUpperCase(),
            sessionId: session.id,
            itemName: itemName.trim(),
            receivedDate,
            isReturned: false,
            notes: notes.trim()
        });
        
        setItemName('');
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
                        <h3 className="text-2xl font-black uppercase tracking-tight">Client Equipment Ledger</h3>
                        <p className="text-sm font-bold text-muted-foreground mt-1 tracking-wide">Track SSDs, pendrives, and physical items handed over</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <X size={24} className="text-muted-foreground" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Equipment Log */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 select-none">Logged Items</h4>
                        {equipmentList.length === 0 ? (
                            <div className="text-center py-8 bg-secondary/20 rounded-2xl border border-dashed border-secondary">
                                <p className="text-sm font-bold text-muted-foreground">No equipment logged for this session yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {equipmentList.map(item => (
                                    <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${item.isReturned ? 'bg-secondary/30 border-black/5 opacity-60' : 'bg-white border-black/10 shadow-sm'} group`}>
                                        <div className="flex items-center gap-4">
                                            <button 
                                                onClick={() => updateClientEquipment(item.id, { isReturned: !item.isReturned })}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${item.isReturned ? 'bg-emerald-50 text-emerald-600' : 'bg-secondary text-muted-foreground hover:bg-black/5 hover:text-black'}`}
                                            >
                                                {item.isReturned ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                            </button>
                                            <div>
                                                <p className={`font-bold text-lg leading-none mb-1 ${item.isReturned ? 'line-through text-muted-foreground' : 'text-black'}`}>{item.itemName}</p>
                                                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(item.receivedDate).toLocaleDateString()}</span>
                                                    {item.isReturned && <span className="text-emerald-600 uppercase tracking-widest text-[9px] px-2 bg-emerald-50 rounded-full">Returned</span>}
                                                    {item.notes && !item.isReturned && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="truncate max-w-[200px]">{item.notes}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => { if(window.confirm('Delete this equipment tracking record?')) deleteClientEquipment(item.id) }} 
                                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all shrink-0"
                                            title="Delete Item"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Add Equipment Form */}
                <div className="p-8 bg-zinc-50/80 border-t border-black/5">
                    <form onSubmit={handleAddEquipment} className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Item Description</label>
                            <input type="text" required value={itemName} onChange={e => setItemName(e.target.value)} className="input-field bg-white" placeholder="e.g. SanDisk 1TB SSD" />
                        </div>
                        <div className="flex-1 space-y-2 max-w-[150px]">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Received On</label>
                            <input type="date" required value={receivedDate} onChange={e => setReceivedDate(e.target.value)} className="input-field bg-white" />
                        </div>
                        <div className="flex-1 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Notes (Optional)</label>
                            <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="input-field bg-white" placeholder="e.g. Needs formatting" />
                        </div>
                        <button type="submit" className="h-12 w-12 rounded-xl bg-black text-white hover:bg-black/80 transition-all flex items-center justify-center shrink-0" title="Log Item">
                            <HardDrive size={20} />
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
