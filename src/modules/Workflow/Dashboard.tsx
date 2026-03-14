import { useApp } from '../../hooks/AppContext';
import { ArrowRight, CheckCircle2, CheckCircle, Plus, Camera, Edit3, CreditCard, Send, Archive, HardDrive } from 'lucide-react';
import type { WorkflowStage, Session } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { PaymentModal } from './PaymentModal';
import { EquipmentLedgerModal } from './EquipmentLedgerModal';
import { useState } from 'react';

const STAGES: WorkflowStage[] = ['INTAKE', 'PHOTOGRAPHY', 'EDITING', 'PAYMENT', 'DELIVERY', 'CLOSED'];

const STAGE_ICONS: Record<string, any> = {
    'INTAKE': <Plus size={20} />,
    'PHOTOGRAPHY': <Camera size={20} />,
    'EDITING': <Edit3 size={20} />,
    'PAYMENT': <CreditCard size={20} />,
    'DELIVERY': <Send size={20} />,
    'CLOSED': <Archive size={20} />
};

export function Dashboard({ onNewProject }: { onNewProject?: () => void }) {
    const { sessions, clients, updateSession, deleteSession, user } = useApp();
    const isAdmin = user?.role === 'admin';
    const [activePaymentSession, setActivePaymentSession] = useState<Session | null>(null);
    const [activeEquipmentSession, setActiveEquipmentSession] = useState<Session | null>(null);

    const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Unknown Client';

    const getEarliestDate = (events: any[]) => {
        if (!events || !events.length) return 'TBD';
        return [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0].date;
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
            deleteSession(id);
        }
    };

    const moveNext = (session: Session) => {
        const currentIndex = STAGES.indexOf(session.stage);
        if (currentIndex < STAGES.length - 1) {
            if (session.stage === 'EDITING') {
                if (!session.editingStatus.photos || !session.editingStatus.videos) {
                    return alert('Both Photos and Videos must be complete to proceed.');
                }
            }

            if (session.stage === 'PAYMENT') {
                const totalPaid = (session.payments || []).reduce((sum, p) => sum + p.amount, 0);
                if (totalPaid < session.grandTotal) {
                    return alert('Full payment must be logged to proceed to Delivery.');
                }
            }

            updateSession(session.id, { stage: STAGES[currentIndex + 1] });
        } else if (session.stage === 'DELIVERY') {
            updateSession(session.id, { stage: 'CLOSED', isDelivered: true });
        }
    };

    return (
        <div className="space-y-8 md:space-y-12 max-w-7xl mx-auto">
            <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 pb-4 md:pb-8 border-b border-black/5">
                <div>
                    <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-foreground mb-1 uppercase">ACTIVE</h2>
                    <h2 className="text-xl md:text-2xl font-black tracking-[0.3em] text-foreground/40 leading-none">WORKFLOW</h2>
                </div>
                <button onClick={onNewProject} className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 bg-black text-white hover:bg-zinc-800 transition-all rounded-none font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] flex items-center justify-center sm:justify-start gap-3 md:gap-4 shrink-0">
                    <Plus size={18} />
                    <span>Initiate Intake</span>
                </button>
            </header>

            <div className="grid grid-cols-1 gap-8">
                <AnimatePresence mode="popLayout">
                    {sessions.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="card-premium p-8 md:p-24 text-center border-dashed border-2 flex flex-col items-center justify-center bg-secondary/20"
                        >
                            <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center text-muted-foreground mb-6">
                                <Archive size={40} />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">No projects yet</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto mb-8">Ready to start something new? Click the button above to begin a new client intake.</p>
                            <button onClick={onNewProject} className="btn-primary">Get Started</button>
                        </motion.div>
                    ) : (
                        sessions.map((session: Session) => (
                            <motion.div
                                layout
                                key={session.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="card-premium group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/10 transition-colors duration-500"></div>

                                <div className="flex flex-col lg:flex-row gap-8 relative z-10">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-4 mb-6">
                                            <span className="text-[10px] font-black text-white bg-black px-4 py-1.5 uppercase tracking-widest break-all">
                                                ID: {session.id}
                                            </span>
                                            <h3 className="font-light text-2xl md:text-3xl tracking-tighter uppercase break-words">{getClientName(session.clientId)}</h3>
                                            {session.stage === 'CLOSED' && (
                                                <span className="flex items-center gap-1.5 text-[9px] font-black text-black border border-black px-3 py-1 uppercase tracking-widest">
                                                    DOCUMENTED
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-6 md:gap-10 text-sm mb-6">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Commencement</span>
                                                <span className="font-bold">{getEarliestDate(session.events)}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Scale</span>
                                                <span className="font-bold">{session.events?.length || 0} Key Events</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Valuation</span>
                                                <span className="font-black text-xl tracking-tight">₹{session.grandTotal.toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {session.events?.map((ev, i) => (
                                                <div key={i} className="flex items-center gap-1 bg-secondary/80 text-muted-foreground px-2 py-1 rounded-md border border-border/50 group/event transition-colors hover:bg-secondary">
                                                    <span className="text-[9px] font-black">{ev.name}</span>
                                                    <span className="text-[9px] font-black opacity-40 mx-1">•</span>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.1"
                                                        className="w-12 bg-transparent text-[9px] font-black outline-none placeholder-muted-foreground/50 pr-1 group-hover/event:text-foreground transition-colors"
                                                        placeholder="0"
                                                        value={ev.dataSizeGB || ''}
                                                        onChange={(e) => {
                                                            const newEvents = [...session.events];
                                                            newEvents[i] = { ...newEvents[i], dataSizeGB: parseFloat(e.target.value) || 0 };
                                                            updateSession(session.id, { events: newEvents });
                                                        }}
                                                    />
                                                    <span className="text-[9px] font-black text-muted-foreground/60">GB</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 shrink-0">
                                        <button
                                            onClick={() => setActiveEquipmentSession(session)}
                                            className="p-3 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                            title="View Equipment Ledger"
                                        >
                                            <HardDrive size={20} />
                                        </button>
                                        <button
                                            onClick={() => setActivePaymentSession(session)}
                                            className="p-3 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                            title="View Payment Ledger"
                                        >
                                            <CreditCard size={20} />
                                        </button>

                                        {isAdmin && (
                                            <button
                                                onClick={() => handleDelete(session.id)}
                                                className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                                                title="Delete Project"
                                            >
                                                <Archive size={20} />
                                            </button>
                                        )}

                                        {session.stage === 'CLOSED' ? (
                                            <div className="flex items-center gap-2 px-8 py-3 bg-secondary/50 text-muted-foreground rounded-2xl font-bold grayscale cursor-default">
                                                <Archive size={20} /> Project Archived
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => moveNext(session)}
                                                className="btn-primary flex items-center gap-3 pr-4 group"
                                            >
                                                <span className="pl-2">Complete {session.stage}</span>
                                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                                    <ArrowRight size={18} />
                                                </div>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-8 md:mt-12 relative overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                                    <div className="absolute top-[1.35rem] left-4 md:left-0 right-4 md:right-0 min-w-[500px] h-1 bg-secondary rounded-full"></div>
                                    <div className="flex justify-between items-start min-w-[500px]">
                                        {STAGES.map((stage, idx) => {
                                            const currentIdx = STAGES.indexOf(session.stage);
                                            const isPast = idx < currentIdx || session.stage === 'CLOSED';
                                            const isCurrent = stage === session.stage;

                                            return (
                                                <div key={stage} className="relative z-10 flex flex-col items-center flex-1 group/stage">
                                                    <div className={`
                                                        w-12 h-12 rounded-none flex items-center justify-center transition-all duration-500 border border-black/5
                                                        ${isPast ? 'bg-black text-white' :
                                                            isCurrent ? 'bg-black text-white ring-8 ring-black/5 scale-110' :
                                                                'bg-white text-zinc-400 border-zinc-100'}
                                                    `}>
                                                        {isPast ? <CheckCircle2 size={20} /> : STAGE_ICONS[stage]}
                                                    </div>

                                                    <span className={`mt-4 text-[9px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${isCurrent ? 'text-black' : isPast ? 'text-zinc-600' : 'text-zinc-300'
                                                        }`}>
                                                        {stage}
                                                    </span>

                                                    <AnimatePresence>
                                                        {isCurrent && stage === 'EDITING' && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: 5 }}
                                                                className="mt-4 flex gap-2"
                                                            >
                                                                <button
                                                                    onClick={() => updateSession(session.id, { editingStatus: { ...session.editingStatus, photos: !session.editingStatus.photos } })}
                                                                    className={`px-4 py-1.5 border text-[9px] font-black tracking-widest uppercase transition-all ${session.editingStatus.photos
                                                                            ? 'bg-black text-white border-black'
                                                                            : 'bg-white border-zinc-200 text-zinc-400 hover:border-black'
                                                                        }`}
                                                                >
                                                                    Photos
                                                                </button>
                                                                <button
                                                                    onClick={() => updateSession(session.id, { editingStatus: { ...session.editingStatus, videos: !session.editingStatus.videos } })}
                                                                    className={`px-4 py-1.5 border text-[9px] font-black tracking-widest uppercase transition-all ${session.editingStatus.videos
                                                                            ? 'bg-black text-white border-black'
                                                                            : 'bg-white border-zinc-200 text-zinc-400 hover:border-black'
                                                                        }`}
                                                                >
                                                                    Videos
                                                                </button>
                                                            </motion.div>
                                                        )}

                                                        {isCurrent && stage === 'PAYMENT' && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: 5 }}
                                                                className="mt-4"
                                                            >
                                                                <button
                                                                    onClick={() => setActivePaymentSession(session)}
                                                                    className={`px-6 py-2 border text-[9px] font-black tracking-widest uppercase transition-all flex items-center gap-2 ${
                                                                        ((session.payments || []).reduce((sum, p) => sum + p.amount, 0) >= session.grandTotal)
                                                                            ? 'bg-black text-white border-black'
                                                                            : 'bg-white border-zinc-200 text-zinc-400 hover:border-black'
                                                                    }`}
                                                                >
                                                                    {((session.payments || []).reduce((sum, p) => sum + p.amount, 0) >= session.grandTotal) ? (
                                                                        <><CheckCircle size={14} /> Full Paid</>
                                                                    ) : (
                                                                        <><CreditCard size={14} /> Log Payment</>
                                                                    )}
                                                                </button>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {activePaymentSession && (
                    <PaymentModal 
                        session={sessions.find(s => s.id === activePaymentSession.id)!} 
                        onClose={() => setActivePaymentSession(null)} 
                    />
                )}
                {activeEquipmentSession && (
                    <EquipmentLedgerModal
                        session={sessions.find(s => s.id === activeEquipmentSession.id)!}
                        onClose={() => setActiveEquipmentSession(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
