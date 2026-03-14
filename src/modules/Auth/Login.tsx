import { useState } from 'react';
import { useApp } from '../../hooks/AppContext';
import { Shield, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Login() {
    const { login } = useApp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const success = await login(email, password);
            if (!success) {
                setError('Electronic credentials rejected. Direct identity confirmation required.');
                setIsLoading(false);
            }
        } catch (error) {
            setError('Electronic credentials rejected. Direct identity confirmation required.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-black">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[480px] z-10"
            >
                <div className="p-12 border border-white/10 shadow-2xl relative overflow-hidden bg-zinc-950">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-none mb-8 ring-1 ring-white/10">
                            <span className="text-4xl font-black text-white">K</span>
                        </div>
                        <h1 className="text-5xl font-light tracking-tighter text-white mb-1 uppercase">WEDDINGS</h1>
                        <h2 className="text-xl font-black tracking-[0.4em] text-white/40 mb-12">BY KRANTHI</h2>
                        <div className="h-px w-12 bg-white/20 mx-auto mb-12"></div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Access Identity</label>
                            <input
                                type="email"
                                placeholder="admin@kranthi.com"
                                className="w-full bg-white/5 border border-white/10 rounded-none py-5 px-6 text-white outline-none focus:border-white transition-all placeholder:text-zinc-700 font-bold"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Secure Key</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-none py-5 px-6 text-white outline-none focus:border-white transition-all placeholder:text-zinc-700"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="text-white text-[10px] font-black uppercase tracking-widest bg-zinc-900 p-4 border-l-2 border-white"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`
                                w-full h-18 py-6 bg-white text-black font-black text-[11px] tracking-[0.4em] uppercase transition-all duration-500 hover:bg-zinc-200 disabled:opacity-50
                            `}
                        >
                            {isLoading ? 'Verifying Identity...' : 'Authorize Session'}
                        </button>
                    </form>

                    <div className="mt-16 flex items-center justify-center gap-12 pt-8 border-t border-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                        <div className="flex items-center gap-2">
                            <Shield size={12} /> SECURE PORTAL
                        </div>
                        <div className="flex items-center gap-2">
                            <Users size={12} /> ENTERPRISE
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-zinc-700 text-[9px] font-black tracking-[0.4em] uppercase">
                        &copy; 2026 WEDDINGS BY KRANTHI. ALL RIGHTS RESERVED.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
