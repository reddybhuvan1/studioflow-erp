import { X, Calendar, Activity, CheckCircle, CreditCard, Box } from 'lucide-react';
import type { Client, Session } from '../../types';
import { motion } from 'framer-motion';

export function ClientHistoryModal({ client, sessions, onClose }: { client: Client, sessions: Session[], onClose: () => void }) {
    
    // Sort sessions logically: Active first, then by date.
    const sortedSessions = [...sessions].sort((a, b) => {
        if (a.stage !== 'Closed' && b.stage === 'Closed') return -1;
        if (a.stage === 'Closed' && b.stage !== 'Closed') return 1;
        
        // Secondary sort by earliest event date
        const dateA = a.events?.[0]?.date || '9999-12-31';
        const dateB = b.events?.[0]?.date || '9999-12-31';
        return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                <div className="p-8 border-b border-black/5 flex justify-between items-center bg-zinc-50/50">
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight">{client.name}'s History</h3>
                        <p className="text-sm font-bold text-muted-foreground mt-1 tracking-wide">
                            {sessions.length} recorded session{sessions.length === 1 ? '' : 's'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <X size={24} className="text-muted-foreground" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {sortedSessions.length === 0 ? (
                        <div className="text-center py-12 bg-secondary/30 rounded-3xl border border-dashed border-secondary">
                            <Box className="mx-auto text-muted-foreground/30 mb-4" size={48} />
                            <h3 className="text-lg font-bold text-muted-foreground">No sessions recorded yet</h3>
                        </div>
                    ) : (
                        sortedSessions.map((session, index) => {
                            const totalPaid = (session.payments || []).reduce((sum, p) => sum + p.amount, 0);
                            const balance = session.grandTotal - totalPaid;
                            const isFullyPaid = balance <= 0;
                            
                            const eventsText = session.events?.map(e => e.name).join(', ') || 'No specific events';
                            const earliestDate = session.events?.length ? 
                                session.events.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0].date : 
                                'TBD';

                            return (
                                <motion.div 
                                    key={session.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`p-6 rounded-2xl border ${session.stage === 'Closed' ? 'bg-secondary/20 border-black/5' : 'bg-white border-black/10 shadow-sm'}`}
                                >
                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-black/5 px-3 py-1 rounded-full mb-2 inline-block">
                                                ID: {session.id}
                                            </span>
                                            <h4 className={`text-xl font-black uppercase tracking-tight ${session.stage === 'Closed' ? 'text-black/60' : 'text-black'}`}>
                                                {eventsText}
                                            </h4>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-1.5 ${
                                                session.stage === 'Closed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                                            }`}>
                                                {session.stage === 'Closed' ? <CheckCircle size={14} /> : <Activity size={14} />}
                                                {session.stage}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-black/5">
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Commencement</p>
                                            <p className="font-bold text-sm flex items-center gap-1.5">
                                                <Calendar size={14} className="text-primary/60" />
                                                {earliestDate}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Scale</p>
                                            <p className="font-bold text-sm">
                                                {session.events?.length || 0} Key Events
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Valuation</p>
                                            <p className="font-bold text-sm">
                                                ₹{session.grandTotal.toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Financial State</p>
                                            <div className="flex items-center gap-1.5">
                                                <CreditCard size={14} className={isFullyPaid ? 'text-emerald-500' : 'text-amber-500'} />
                                                <p className={`font-bold text-sm ${isFullyPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                    {isFullyPaid ? 'Settled in Full' : `₹${balance.toLocaleString('en-IN')} Due`}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Sub-events list if not closed, for immediate context */}
                                    {session.stage !== 'Closed' && session.events && session.events.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-black/5 flex flex-wrap gap-2">
                                            {session.events.map((ev, i) => (
                                                <span key={i} className="text-[10px] font-bold text-muted-foreground bg-secondary px-2 py-1 rounded border border-border/50">
                                                    {ev.name} ({ev.dataSizeGB || 0}GB)
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </motion.div>
        </div>
    );
}
