import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  History, 
  PieChart as PieChartIcon,
  Lightbulb,
  User,
  Trash2,
  Calendar,
  Tag,
  FileText,
  DollarSign,
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  ChevronDown
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  AreaChart, 
  Area,
  Legend
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { cn, formatCurrency } from './lib/utils';
import { Transaction, TransactionType, UserProfile, CATEGORIES, TIPS, Currency } from './types';
import { getFinancialTip } from './services/aiService';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('user-profile');
    return saved ? JSON.parse(saved) : { name: 'Sarah Mitchell', currency: 'USD' };
  });
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(user.name);
  const [aiTip, setAiTip] = useState<string>("Analyzing your spending patterns...");

  // Quick Entry Form State
  const [formType, setFormType] = useState<TransactionType>('expense');
  const [formAmount, setFormAmount] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDate, setFormDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [formNote, setFormNote] = useState('');

  // Stats calculations
  const totals = useMemo(() => {
    return transactions.reduce((acc, t) => {
      if (t.type === 'income') acc.income += t.amount;
      else acc.expense += t.amount;
      return acc;
    }, { income: 0, expense: 0 });
  }, [transactions]);

  const balance = totals.income - totals.expense;

  // Persistence
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    // Fetch AI Tip when transactions change meaningfully
    const updateTip = async () => {
      if (transactions.length > 0) {
        const summary = `Income: ${totals.income}, Expenses: ${totals.expense}, Top Categories: ${transactions.slice(0,5).map(t => t.category).join(', ')}`;
        const tip = await getFinancialTip(summary);
        setAiTip(tip);
      } else {
        setAiTip(TIPS[0]);
      }
    };
    
    const timeoutId = setTimeout(updateTip, 1000); // Debounce AI calls
    return () => clearTimeout(timeoutId);
  }, [transactions, totals.income, totals.expense]);

  useEffect(() => {
    localStorage.setItem('user-profile', JSON.stringify(user));
  }, [user]);

  const addTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAmount || !formCategory) return;
    
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      type: formType,
      amount: parseFloat(formAmount),
      category: formCategory,
      date: formDate,
      note: formNote
    };

    setTransactions([newTransaction, ...transactions]);
    
    // Reset form partially
    setFormAmount('');
    setFormNote('');
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleNameSave = () => {
    setUser({ ...user, name: tempName });
    setEditingName(false);
  };

  const handleCurrencyChange = (curr: Currency) => {
    setUser({ ...user, currency: curr });
  };

  const exportCSV = () => {
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Note'];
    const rows = transactions.map(t => [
      t.date,
      t.type,
      t.category,
      t.amount,
      t.note
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `spendwise-export-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 border-x border-slate-200 shadow-xl overflow-x-hidden">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 pb-4">
        <div>
          <div className="flex items-center gap-3">
            {editingName ? (
              <input 
                type="text" 
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="text-2xl font-bold bg-white border border-indigo-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
                onBlur={handleNameSave}
                onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
              />
            ) : (
              <h1 
                className="text-2xl font-bold text-slate-800 cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() => setEditingName(true)}
              >
                Welcome back, <span className="text-indigo-600">{user.name}</span>
              </h1>
            )}
          </div>
          <p className="text-slate-500 text-sm">Here is your financial summary for {format(new Date(), 'MMMM yyyy')}.</p>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          {/* Currency Switcher */}
          <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            {(['USD', 'BDT', 'INR'] as Currency[]).map((curr) => (
              <button
                key={curr}
                onClick={() => handleCurrencyChange(curr)}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-bold transition-all",
                  user.currency === curr ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-slate-500 hover:text-slate-800"
                )}
              >
                {curr === 'BDT' ? '৳' : curr === 'INR' ? '₹' : '$'}
              </button>
            ))}
          </div>

          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
          >
            <Download size={16} />
            Export CSV
          </button>
          <button 
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all cursor-pointer"
            onClick={() => {
              const aside = document.getElementById('quick-entry');
              aside?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            + New Entry
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 p-8 pt-4 min-h-0">
        {/* Left Sidebar: Data Entry */}
        <aside id="quick-entry" className="w-full lg:w-[320px] bg-white rounded-3xl border border-slate-200 p-6 flex flex-col shadow-sm h-fit">
          <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
            <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
            Quick Entry
          </h2>
          <form onSubmit={addTransaction} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Transaction Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  type="button" 
                  onClick={() => { setFormType('expense'); setFormCategory(''); }}
                  className={cn(
                    "py-2 px-4 rounded-lg border-2 transition-all font-semibold text-sm",
                    formType === 'expense' ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-slate-200 bg-white text-slate-500"
                  )}
                >
                  Expense
                </button>
                <button 
                  type="button" 
                  onClick={() => { setFormType('income'); setFormCategory(''); }}
                  className={cn(
                    "py-2 px-4 rounded-lg border-2 transition-all font-semibold text-sm",
                    formType === 'income' ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-slate-200 bg-white text-slate-500"
                  )}
                >
                  Income
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400">
                  {user.currency === 'BDT' ? '৳' : user.currency === 'INR' ? '₹' : '$'}
                </span>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  placeholder="0.00" 
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-slate-50" 
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
              <select 
                required
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm appearance-none bg-slate-50"
              >
                <option value="">Select Category</option>
                {(formType === 'income' ? CATEGORIES.income : CATEGORIES.expense).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Date</label>
              <input 
                type="date" 
                required
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-slate-50" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Note</label>
              <textarea 
                placeholder="Add a short description..." 
                value={formNote}
                onChange={(e) => setFormNote(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm h-20 resize-none bg-slate-50"
              ></textarea>
            </div>
            <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold mt-2 shadow-xl shadow-slate-200 active:scale-95 transition-all hover:bg-slate-800 cursor-pointer">
              Add Transaction
            </button>
          </form>

          {/* Activity Section moved here or stays below */}
          <div className="mt-8 pt-8 border-t border-slate-100 flex-1 overflow-hidden flex flex-col">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-2">
              <History size={16} />
              Recent Activity
            </h3>
            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1 max-h-[300px]">
              {transactions.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4">No recent activity.</p>
              ) : (
                transactions.slice(0, 10).map((t, idx) => (
                  <TransactionItem 
                    key={t.id} 
                    transaction={t} 
                    onDelete={deleteTransaction} 
                    delay={idx * 0.05} 
                    currency={user.currency}
                  />
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col gap-6 overflow-y-auto lg:overflow-visible pr-1">
          {/* Dashboard Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl shadow-sm transition-all hover:shadow-md">
              <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">Total Income</p>
              <h3 className="text-3xl font-black text-emerald-900 leading-tight">{formatCurrency(totals.income, user.currency)}</h3>
            </div>
            <div className="bg-rose-50 border border-rose-100 p-5 rounded-3xl shadow-sm transition-all hover:shadow-md">
              <p className="text-rose-600 text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">Total Expense</p>
              <h3 className="text-3xl font-black text-rose-900 leading-tight">{formatCurrency(totals.expense, user.currency)}</h3>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-3xl shadow-sm transition-all hover:shadow-md">
              <p className="text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">Current Balance</p>
              <h3 className="text-3xl font-black text-indigo-900 leading-tight">{formatCurrency(balance, user.currency)}</h3>
            </div>
          </div>

          {/* Interactive Visualizations Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-[400px]">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col">
              <h4 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider flex items-center justify-between">
                Expense Distribution
                <span className="text-xs text-slate-400 normal-case font-normal">By Category</span>
              </h4>
              <div className="flex-1 min-h-[250px]">
                <ExpensePieChart transactions={transactions} currency={user.currency} />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col">
              <h4 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider flex items-center justify-between">
                Recent Trend
                <span className="text-xs text-slate-400 normal-case font-normal">Daily tracking</span>
              </h4>
              <div className="flex-1 min-h-[250px]">
                <TrendChart transactions={transactions} currency={user.currency} />
              </div>
            </div>
          </div>

          {/* Smart Tips Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-600 rounded-[32px] p-6 text-white flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-indigo-100"
          >
            <div className="bg-indigo-500 p-4 rounded-2xl shrink-0">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h5 className="font-bold text-lg">Smart Saving Tip</h5>
              <p className="text-indigo-100 text-sm opacity-90 leading-relaxed italic">
                "{aiTip}"
              </p>
            </div>
            <button 
              onClick={() => {}}
              className="md:ml-auto bg-white/20 hover:bg-white/30 px-6 py-2 rounded-xl text-xs font-bold transition-all backdrop-blur-sm cursor-pointer whitespace-nowrap"
            >
              Learn More
            </button>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

// Sub-components

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
  delay: number;
  currency: Currency;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onDelete, delay, currency }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="group p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-transparent hover:border-indigo-100 hover:bg-white transition-all"
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
          transaction.type === 'income' ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
        )}>
          {transaction.type === 'income' ? <IncomeIcon size={16} /> : <ExpenseIcon size={16} />}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-800 leading-none">{transaction.category}</p>
          <p className="text-[9px] text-slate-400 mt-1">{format(parseISO(transaction.date), 'MMM d, yyyy')}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <p className={cn(
          "text-xs font-bold",
          transaction.type === 'income' ? "text-emerald-600" : "text-slate-900"
        )}>
          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
        </p>
        <button 
          onClick={() => onDelete(transaction.id)}
          className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-rose-500 transition-all rounded-md"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </motion.div>
  );
}

// Chart Components

const PIE_COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

function ExpensePieChart({ transactions, currency }: { transactions: Transaction[], currency: Currency }) {
  const data = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
        No expense data yet
      </div>
    );
  }

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="h-full relative flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              borderRadius: '20px', 
              border: 'none', 
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
              padding: '12px'
            }}
            formatter={(value: number) => [formatCurrency(value, currency), 'Total']}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-4">
        <p className="text-2xl font-black text-slate-900 leading-none">
          {currency === 'BDT' ? '৳' : currency === 'INR' ? '₹' : '$'}
          {total > 1000 ? (total/1000).toFixed(1) + 'k' : total.toFixed(0)}
        </p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Spent</p>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2 w-full px-4">
        {data.slice(0, 4).map((item, idx) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}></div>
            <span className="text-[10px] font-medium text-slate-600 truncate">{item.name}</span>
            <span className="text-[10px] font-bold text-slate-400 ml-auto">{((item.value/total)*100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendChart({ transactions, currency }: { transactions: Transaction[], currency: Currency }) {
  const data = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return format(d, 'yyyy-MM-dd');
    });

    return last7Days.map(date => {
      const dayTransactions = transactions.filter(t => t.date === date);
      const income = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expense = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      
      return {
        date: format(parseISO(date), 'EEE'),
        Income: income,
        Expenses: expense
      };
    });
  }, [transactions]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey="date" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
          dy={10}
        />
        <YAxis hide />
        <Tooltip 
           contentStyle={{ 
            borderRadius: '20px', 
            border: 'none', 
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            padding: '12px'
          }}
          formatter={(value: number) => [formatCurrency(value, currency), '']}
        />
        <Area 
          type="monotone" 
          dataKey="Income" 
          stroke="#10b981" 
          strokeWidth={4}
          fillOpacity={1} 
          fill="url(#colorIncome)" 
        />
        <Area 
          type="monotone" 
          dataKey="Expenses" 
          stroke="#ef4444" 
          strokeWidth={4}
          fillOpacity={1} 
          fill="url(#colorExpense)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
