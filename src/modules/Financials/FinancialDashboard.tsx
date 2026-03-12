import { useApp } from '../../hooks/AppContext';
import { IndianRupee, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Activity, Wallet, PieChart, BarChart3 } from 'lucide-react';

export function FinancialDashboard() {
    const { sessions, freelancerPayments, expenses } = useApp();

    // 1. Calculate Gross Revenue (Only Paid projects)
    const grossRevenue = sessions.filter(s => s.isPaid).reduce((sum, s) => sum + s.grandTotal, 0);

    // 2. Calculate Freelancer Payouts
    const totalPayouts = freelancerPayments.reduce((sum, p) => sum + p.amount, 0);

    // 3. Calculate Overhead/Expenses
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    // 4. Calculate Net Profit
    const totalCosts = totalPayouts + totalExpenses;
    const netProfit = grossRevenue - totalCosts;

    // 5. Margin %
    const margin = grossRevenue > 0 ? ((netProfit / grossRevenue) * 100).toFixed(1) : '0.0';

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24">
            <header className="flex justify-between items-end pb-8 border-b border-black/5">
                <div>
                    <h2 className="text-5xl font-light tracking-tighter text-foreground mb-1 uppercase">FINANCIALS</h2>
                    <h2 className="text-2xl font-black tracking-[0.3em] text-foreground/40 leading-none">COMMAND CENTER</h2>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Fiscal Health Margin</div>
                    <div className={`text-3xl font-black ${parseFloat(margin) > 0 ? 'text-emerald-500' : 'text-destructive'}`}>
                        {margin}%
                    </div>
                </div>
            </header>

            {/* Top Level KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Gross Revenue */}
                <div className="card-premium p-6 border-emerald-500/20 bg-emerald-500/5 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform">
                        <TrendingUp size={48} className="text-emerald-600" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700/70 mb-4 flex items-center gap-2">
                        <ArrowUpRight size={14} /> Gross Revenue
                    </h3>
                    <div className="text-3xl font-black text-emerald-700 mb-1 flex items-center gap-1">
                        <IndianRupee size={20} />
                        {grossRevenue.toLocaleString('en-IN')}
                    </div>
                    <p className="text-[10px] font-bold text-emerald-700/50 uppercase tracking-widest">Inflow from Paid Projects</p>
                </div>

                {/* Freelancer Payouts */}
                <div className="card-premium p-6 border-amber-500/20 bg-amber-500/5 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform">
                        <TrendingDown size={48} className="text-amber-600" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700/70 mb-4 flex items-center gap-2">
                        <ArrowDownRight size={14} /> Freelancer Cost
                    </h3>
                    <div className="text-3xl font-black text-amber-700 mb-1 flex items-center gap-1">
                        <IndianRupee size={20} />
                        {totalPayouts.toLocaleString('en-IN')}
                    </div>
                    <p className="text-[10px] font-bold text-amber-700/50 uppercase tracking-widest">Total Contractor Payouts</p>
                </div>

                {/* Studio Expenses */}
                <div className="card-premium p-6 border-rose-500/20 bg-rose-500/5 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform">
                        <Wallet size={48} className="text-rose-600" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-700/70 mb-4 flex items-center gap-2">
                        <ArrowDownRight size={14} /> Studio Overheads
                    </h3>
                    <div className="text-3xl font-black text-rose-700 mb-1 flex items-center gap-1">
                        <IndianRupee size={20} />
                        {totalExpenses.toLocaleString('en-IN')}
                    </div>
                    <p className="text-[10px] font-bold text-rose-700/50 uppercase tracking-widest">Maintenance & Operations</p>
                </div>

                {/* Net Profit */}
                <div className={`card-premium p-6 border-black bg-black text-white group relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform">
                        <Activity size={48} className="text-white" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-4 flex items-center gap-2">
                        <Activity size={14} className="text-white" /> Net Profit
                    </h3>
                    <div className="text-3xl font-black text-white mb-1 flex items-center gap-1">
                        <IndianRupee size={20} />
                        {netProfit.toLocaleString('en-IN')}
                    </div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Absolute Take Home</p>
                </div>
            </div>

            {/* Detailed Breakdowns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Expense Breakdown */}
                <div className="card-premium p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-black text-lg flex items-center gap-2"><PieChart size={18} className="text-primary" /> Cost Distribution</h3>
                            <p className="text-sm font-bold text-muted-foreground mt-1">Where your money is going (Aggregated)</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                            <Wallet size={18} className="text-muted-foreground" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Freelancers vs Studio */}
                        <div>
                            <div className="flex justify-between text-sm font-black mb-2">
                                <span>Freelancers</span>
                                <span>₹{totalPayouts.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500" style={{ width: `${totalCosts > 0 ? (totalPayouts / totalCosts) * 100 : 0}%` }}></div>
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex justify-between text-sm font-black mb-2">
                                <span>Studio Overheads</span>
                                <span>₹{totalExpenses.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-rose-500" style={{ width: `${totalCosts > 0 ? (totalExpenses / totalCosts) * 100 : 0}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overhead Category Breakdown */}
                <div className="card-premium p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-black text-lg flex items-center gap-2"><BarChart3 size={18} className="text-primary" /> Overhead Categorization</h3>
                            <p className="text-sm font-bold text-muted-foreground mt-1">Detailed breakdown of studio maintenance</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {expenses.length === 0 ? (
                            <div className="text-center py-8 text-sm font-bold text-muted-foreground">No overhead expenses recorded yet.</div>
                        ) : (
                            Object.entries(
                                expenses.reduce((acc, curr) => {
                                    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
                                    return acc;
                                }, {} as Record<string, number>)
                            )
                            .sort(([, a], [, b]) => b - a)
                            .map(([category, amount]) => (
                                <div key={category} className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg border border-border/50">
                                    <span className="text-sm font-black">{category}</span>
                                    <span className="text-sm font-bold text-muted-foreground">₹{amount.toLocaleString('en-IN')}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                
            </div>
        </div>
    );
}
