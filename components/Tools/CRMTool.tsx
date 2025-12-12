
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts';
import { apiClient } from '../../lib/apiClient';
import { useToast } from '../ui/Toast';
import { 
  LayoutDashboard, 
  Users, 
  Box, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Menu, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  DollarSign, 
  Ticket, 
  MoreVertical, 
  Filter,
  LifeBuoy,
  X,
  CheckCircle,
  AlertCircle,
  Download,
  Plus,
  Minus,
  Trash2,
  Save,
  ShieldAlert,
  Mail,
  Activity, Calendar, Phone, MapPin, Tag
} from 'lucide-react';

// --- MOCK DATA ---
const revenueDataWeekly = [
  { name: 'Lun', leads: 4000, redeemed: 2400 },
  { name: 'Mar', leads: 3000, redeemed: 1398 },
  { name: 'Mie', leads: 2000, redeemed: 9800 },
  { name: 'Jue', leads: 2780, redeemed: 3908 },
  { name: 'Vie', leads: 1890, redeemed: 4800 },
  { name: 'Sab', leads: 2390, redeemed: 3800 },
  { name: 'Dom', leads: 3490, redeemed: 4300 },
];

const revenueDataMonthly = [
  { name: 'Sem 1', leads: 12000, redeemed: 8400 },
  { name: 'Sem 2', leads: 15000, redeemed: 9398 },
  { name: 'Sem 3', leads: 9000, redeemed: 4800 },
  { name: 'Sem 4', leads: 18780, redeemed: 12908 },
];

const initialPrizesData = [
    { id: 1, label: "Shot 2x1", color: "#40d4f7", stock: 30, prob: "22%" }, 
    { id: 2, label: "10% OFF", color: "#ec4899", stock: 50, prob: "25%" },
    { id: 3, label: "Gracias por participar", color: "#334155", stock: 9999, prob: "33%" },
    { id: 4, label: "Combo Nachos 3x", color: "#22c55e", stock: 10, prob: "10%" },
    { id: 5, label: "Merch sorpresa", color: "#fbbf24", stock: 6, prob: "7%" },
    { id: 6, label: "Gran Premio: Cena", color: "#8b5cf6", stock: 2, prob: "3%" },
];

const prizeDistribution = [
  { name: 'Descuentos', value: 45, color: '#40d4f7' },
  { name: 'Producto Gratis', value: 30, color: '#8b5cf6' },
  { name: 'Merch', value: 15, color: '#ec4899' },
  { name: 'Gran Premio', value: 10, color: '#22c55e' },
];

const STATIC_WINNERS = [
    { id: 1, name: 'Sofia Martínez', email: 'sofia.m@gmail.com', phone: '+52 55 1234 5678', img: 'https://i.pravatar.cc/100?img=5', prize: 'Shot 2x1', date: 'Hace 2 min', status: 'Pendiente', value: 50, coupon: 'SHOT-2X1-A82' },
    { id: 2, name: 'Jorge López', email: 'jorge.lop@outlook.com', phone: '+52 55 8765 4321', img: 'https://i.pravatar.cc/100?img=11', prize: '10% OFF', date: 'Hace 5 min', status: 'Canjeado', value: 120, coupon: '10OFF-B91' },
    { id: 3, name: 'Ana Rivas', email: 'ana.rivas@yahoo.com', phone: '+52 81 9988 7766', img: 'https://i.pravatar.cc/100?img=9', prize: 'Gran Premio', date: 'Hace 12 min', status: 'Pendiente', value: 800, coupon: 'CENA-GP-X99' },
    { id: 4, name: 'Carlos Díaz', email: 'carlos.d@gmail.com', phone: '+52 33 4455 6677', img: 'https://i.pravatar.cc/100?img=3', prize: 'Combo Nachos', date: 'Hace 15 min', status: 'Canjeado', value: 85, coupon: 'NACHO-C77' },
    { id: 5, name: 'Lucia Pérez', email: 'lperez@hotmail.com', phone: '+52 55 1122 3344', img: 'https://i.pravatar.cc/100?img=6', prize: '10% OFF', date: 'Hace 22 min', status: 'Expirado', value: 0, coupon: '10OFF-E12' },
    { id: 6, name: 'Mario Gomez', email: 'mario.g@gmail.com', phone: '+52 55 6677 8899', img: 'https://i.pravatar.cc/100?img=12', prize: 'Merch', date: 'Hace 1 hora', status: 'Pendiente', value: 25, coupon: 'MERCH-M45' },
    { id: 7, name: 'Elena N.', email: 'elena.n@gmail.com', phone: '+52 55 2233 4455', img: 'https://i.pravatar.cc/100?img=24', prize: 'Shot 2x1', date: 'Hace 2 horas', status: 'Canjeado', value: 50, coupon: 'SHOT-2X1-Z88' },
];

const notifications = [
    { id: 1, text: "Stock bajo en 'Gran Premio'", type: 'warning' },
    { id: 2, text: "Nuevo récord de leads diarios", type: 'success' },
    { id: 3, text: "Actualización del sistema programada", type: 'info' }
];

const SidebarItem = ({ icon: Icon, label, active = false, badge, onClick }: { icon: any, label: string, active?: boolean, badge?: string, onClick?: () => void }) => (
    <div 
        onClick={onClick}
        className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all ${active ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
    >
        <div className="flex items-center gap-3">
            <Icon size={18} />
            <span className="font-medium text-sm">{label}</span>
        </div>
        {badge && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">{badge}</span>}
    </div>
);

const StatCard = ({ title, value, trend, trendUp, icon: Icon, color }: any) => (
    <div className="bg-[#151c2f] p-6 rounded-xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
                <div className="text-2xl font-bold text-white">{value}</div>
            </div>
            <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-400 group-hover:bg-${color}-500/20 transition-colors`}>
                <Icon size={20} />
            </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
            <span className={`flex items-center gap-1 font-bold ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
                {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {trend}
            </span>
            <span className="text-gray-500">vs semana pasada</span>
        </div>
    </div>
);

const CRMTool: React.FC = () => {
  const toast = useToast();
  const [activeView, setActiveView] = useState('Resumen');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [timeRange, setTimeRange] = useState('Semanal');
  
  // Table Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos'); // Todos, Pendiente, Canjeado
  
  // Prize Management State
  const [managedPrizes, setManagedPrizes] = useState(initialPrizesData);
  
  // Dynamic Data State
  const [leadsData, setLeadsData] = useState<any[]>(STATIC_WINNERS); // This will be replaced or modified
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Settings State
  const [settings, setSettings] = useState({
      antiFraud: true,
      emailNotifications: true,
      autoStock: false,
      whatsappIntegration: true
  });

  // Fetch leads from Supabase via Backend API
  const fetchLeads = async () => {
    try {
        const response = await apiClient.get<{ success: boolean; leads: any[]; count: number }>('/leads/list', {
            limit: 100
        });

        // Map backend leads to CRM UI structure
        const mappedLeads = response.leads.map(lead => ({
            id: lead.id,
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            img: `https://i.pravatar.cc/100?u=${lead.id}`,
            prize: lead.prize_label,
            date: new Date(lead.created_at).toLocaleDateString('es-ES'),
            status: lead.status,
            value: lead.estimated_value,
            coupon: lead.coupon_code,
            isNew: false
        }));

        // Combine with static mock data
        setLeadsData([...mappedLeads, ...STATIC_WINNERS]);
    } catch (error) {
        console.warn('Backend no disponible (Localhost). Usando datos de demostración.');
        // Fallback to static data if API fails
        setLeadsData(STATIC_WINNERS);
    } finally {
        setLoading(false);
    }
  };

  // Load data on mount and listen for updates
  useEffect(() => {
    fetchLeads();

    // Listen for custom events when new leads are added
    const handleLeadsUpdate = () => fetchLeads();
    window.addEventListener('crm-data-updated', handleLeadsUpdate);

    return () => {
        window.removeEventListener('crm-data-updated', handleLeadsUpdate);
    };
  }, []);

  // Derived Data - Memoized for performance
  const currentChartData = useMemo(() =>
    timeRange === 'Semanal' ? revenueDataWeekly : revenueDataMonthly,
    [timeRange]
  );

  const filteredWinners = useMemo(() => {
      const searchLower = searchQuery.toLowerCase().trim();

      return leadsData.filter(w => {
          const matchesSearch = !searchLower ||
                                w.name.toLowerCase().includes(searchLower) ||
                                w.prize.toLowerCase().includes(searchLower) ||
                                w.coupon.toLowerCase().includes(searchLower);
          const matchesStatus = statusFilter === 'Todos' || w.status === statusFilter;
          return matchesSearch && matchesStatus;
      });
  }, [searchQuery, statusFilter, leadsData]);

  const toggleStatusFilter = useCallback(() => {
      setStatusFilter(prev => {
          if (prev === 'Todos') return 'Pendiente';
          if (prev === 'Pendiente') return 'Canjeado';
          return 'Todos';
      });
  }, []);

  const updateStock = useCallback((id: number, delta: number) => {
      setManagedPrizes(prev => prev.map(p => {
          if (p.id === id) {
              const newStock = Math.max(0, p.stock + delta);
              return { ...p, stock: newStock };
          }
          return p;
      }));
  }, []);

  const toggleSetting = useCallback((key: keyof typeof settings) => {
      setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const renderContent = () => {
      switch(activeView) {
          case 'Resumen':
              return (
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar animate-in slide-in-from-right-4 duration-500">
                    {/* KPI CARDS ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard 
                            title="Valor Pipeline" 
                            value={`$${(24582 + filteredWinners.length * 50).toLocaleString()}`}
                            trend="18.2%" 
                            trendUp={true} 
                            icon={DollarSign} 
                            color="green" 
                        />
                        <StatCard 
                            title="Leads Totales" 
                            value={(3842 + leadsData.length - STATIC_WINNERS.length).toLocaleString()} 
                            trend="12.5%" 
                            trendUp={true} 
                            icon={Users} 
                            color="cyan" 
                        />
                        <StatCard 
                            title="Premios Entregados" 
                            value="1,247" 
                            trend="2.3%" 
                            trendUp={false} 
                            icon={Box} 
                            color="purple" 
                        />
                        <StatCard 
                            title="Tasa de Canje" 
                            value="42.8%" 
                            trend="24.6%" 
                            trendUp={true} 
                            icon={Ticket} 
                            color="pink" 
                        />
                    </div>

                    {/* CHARTS ROW */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        
                        {/* Main Area Chart */}
                        <div className="lg:col-span-2 bg-[#151c2f] rounded-xl border border-white/5 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Tendencia de Leads</h3>
                                    <div className="text-2xl font-bold">
                                        {timeRange === 'Semanal' ? '$18,200.82' : '$78,450.00'} 
                                        <span className="text-xs font-normal text-green-400 bg-green-500/10 px-2 py-0.5 rounded ml-2">↗ 8.24%</span>
                                    </div>
                                </div>
                                <select 
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}
                                    className="bg-[#0b0f19] border border-white/10 rounded-lg text-xs px-3 py-1.5 text-gray-300 outline-none cursor-pointer focus:border-cyan-500"
                                >
                                    <option value="Semanal">Semanal</option>
                                    <option value="Mensual">Mensual</option>
                                </select>
                            </div>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={currentChartData}>
                                        <defs>
                                            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#40d4f7" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#40d4f7" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <Tooltip 
                                            contentStyle={{backgroundColor: '#0b0f19', borderColor: '#333', borderRadius: '8px'}}
                                            itemStyle={{fontSize: '12px'}}
                                        />
                                        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}k`} />
                                        <Area type="monotone" dataKey="redeemed" stroke="#22c55e" strokeWidth={2} fill="transparent" />
                                        <Area type="monotone" dataKey="leads" stroke="#40d4f7" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Donut Chart */}
                        <div className="bg-[#151c2f] rounded-xl border border-white/5 p-6 flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-lg">Distribución</h3>
                                    <button className="text-gray-400 hover:text-white p-1 hover:bg-white/5 rounded"><MoreVertical size={16} /></button>
                            </div>
                            
                            <div className="flex-1 relative flex items-center justify-center">
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={prizeDistribution}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {prizeDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{backgroundColor: '#0b0f19', borderColor: '#333', borderRadius: '8px'}} />
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Center Text */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-2xl font-bold">16,100</span>
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">Total</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-4">
                                {prizeDistribution.map((item) => (
                                    <div key={item.name} className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                                        <span className="text-xs text-gray-400">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RECENT WINNERS TABLE */}
                    <div className="bg-[#151c2f] rounded-xl border border-white/5 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">Ganadores Recientes</h3>
                            <div className="flex gap-2">
                                <button className="text-xs text-cyan-400 hover:text-cyan-300" onClick={() => setActiveView('Leads')}>Ver Todos</button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="text-gray-500 border-b border-white/5">
                                    <tr>
                                        <th className="pb-3 font-medium">Lead</th>
                                        <th className="pb-3 font-medium">Premio</th>
                                        <th className="pb-3 font-medium">Fecha</th>
                                        <th className="pb-3 font-medium">Estado</th>
                                        <th className="pb-3 font-medium text-right">Valor Est.</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredWinners.slice(0, 5).map((winner) => (
                                        <tr key={winner.id} className="group hover:bg-white/5 transition-colors">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <img src={winner.img} alt={winner.name} className="w-8 h-8 rounded-full" />
                                                        {winner.isNew && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-black animate-pulse"></div>}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-gray-200 block">{winner.name}</span>
                                                        {winner.isNew && <span className="text-[9px] text-cyan-400 font-bold bg-cyan-900/30 px-1 rounded">NUEVO</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 text-gray-400">{winner.prize}</td>
                                            <td className="py-4 text-gray-400">{winner.date}</td>
                                            <td className="py-4">
                                                <span className={`px-2.5 py-1 rounded text-xs font-medium border ${
                                                    winner.status === 'Canjeado' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                                    winner.status === 'Pendiente' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                                }`}>
                                                    {winner.status}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right font-mono text-gray-300">${winner.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
              );
              
          case 'Leads':
              return (
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar animate-in slide-in-from-right-4 duration-500">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Base de Leads</h2>
                            <p className="text-gray-400 text-sm">Gestiona y exporta todos los registros capturados.</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 transition-colors">
                            <Download size={18} /> Exportar CSV
                        </button>
                    </div>

                    <div className="bg-[#151c2f] rounded-xl border border-white/5 p-6 mb-8">
                        <div className="flex gap-4 mb-6">
                            <div className="flex-1 relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Buscar por nombre, cupón o email..." 
                                    className="w-full bg-[#0b0f19] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 focus:border-cyan-500 outline-none"
                                />
                            </div>
                            <button 
                                onClick={toggleStatusFilter}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors ${statusFilter !== 'Todos' ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' : 'border-white/10 text-gray-300 hover:bg-white/5'}`}
                            >
                                <Filter size={16} /> {statusFilter}
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="text-gray-500 border-b border-white/5">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Usuario</th>
                                        <th className="px-4 py-3 font-medium">Contacto</th>
                                        <th className="px-4 py-3 font-medium">Cupón</th>
                                        <th className="px-4 py-3 font-medium">Premio</th>
                                        <th className="px-4 py-3 font-medium">Estado</th>
                                        <th className="px-4 py-3 font-medium text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredWinners.map((winner) => (
                                        <tr key={winner.id} className="group hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <img src={winner.img} alt={winner.name} className="w-8 h-8 rounded-full" />
                                                        {winner.isNew && <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full"></div>}
                                                    </div>
                                                    <span className="font-bold text-gray-200">{winner.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex flex-col text-xs text-gray-400">
                                                    <span>{winner.email}</span>
                                                    <span>{winner.phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 font-mono text-cyan-300">{winner.coupon}</td>
                                            <td className="px-4 py-4 text-gray-300">{winner.prize}</td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2.5 py-1 rounded text-xs font-medium border ${
                                                    winner.status === 'Canjeado' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                                    winner.status === 'Pendiente' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                                }`}>
                                                    {winner.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <button className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"><MoreVertical size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredWinners.length === 0 && (
                                         <tr>
                                            <td colSpan={6} className="py-12 text-center text-gray-500">
                                                No se encontraron resultados para "{searchQuery}"
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
              );

          case 'Premios':
              return (
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar animate-in slide-in-from-right-4 duration-500">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Gestión de Premios</h2>
                            <p className="text-gray-400 text-sm">Controla el stock y las probabilidades de la ruleta en tiempo real.</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors">
                            <Plus size={18} /> Nuevo Premio
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {managedPrizes.map((prize) => (
                            <div key={prize.id} className="bg-[#151c2f] border border-white/5 rounded-xl p-6 relative group hover:border-white/20 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: prize.color }}></div>
                                        <h3 className="font-bold text-white">{prize.label}</h3>
                                    </div>
                                    <span className="text-xs font-mono text-gray-500 bg-[#0b0f19] px-2 py-1 rounded border border-white/5">{prize.prob}</span>
                                </div>
                                
                                <div className="flex items-center justify-between mt-8">
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Stock Disponible</p>
                                        <p className={`text-3xl font-bold font-mono ${prize.stock < 5 ? 'text-red-400' : 'text-white'}`}>{prize.stock}</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-[#0b0f19] rounded-lg p-1 border border-white/5">
                                        <button 
                                            onClick={() => updateStock(prize.id, -1)}
                                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <button 
                                            onClick={() => updateStock(prize.id, 1)}
                                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Mock Progress Bar */}
                                <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                                    <div 
                                        className="h-full bg-cyan-500" 
                                        style={{ width: `${Math.min(100, (prize.stock / 50) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
              );

          case 'Cupones':
              return (
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar animate-in slide-in-from-right-4 duration-500">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Cupones Generados</h2>
                            <p className="text-gray-400 text-sm">Historial de códigos únicos emitidos por el sistema.</p>
                        </div>
                    </div>

                    <div className="bg-[#151c2f] rounded-xl border border-white/5 overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#0b0f19] text-gray-500 font-mono text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-4">Código</th>
                                    <th className="px-6 py-4">Asignado A</th>
                                    <th className="px-6 py-4">Beneficio</th>
                                    <th className="px-6 py-4">Vence</th>
                                    <th className="px-6 py-4 text-right">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredWinners.map(w => (
                                    <tr key={w.id} className="hover:bg-white/5">
                                        <td className="px-6 py-4 font-mono text-cyan-400 font-bold">{w.coupon}</td>
                                        <td className="px-6 py-4 text-gray-300">{w.name}</td>
                                        <td className="px-6 py-4 text-gray-400">{w.prize}</td>
                                        <td className="px-6 py-4 text-gray-500">en 24h</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${w.status === 'Canjeado' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'}`}>
                                                {w.status === 'Canjeado' ? 'USADO' : 'ACTIVO'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
              );
            
            case 'Configuracion':
                return (
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar animate-in slide-in-from-right-4 duration-500">
                        <div className="max-w-3xl">
                            <h2 className="text-2xl font-bold mb-2">Configuración del Sistema</h2>
                            <p className="text-gray-400 text-sm mb-8">Ajusta los parámetros globales de la campaña.</p>

                            <div className="space-y-6">
                                {/* Section 1 */}
                                <div className="bg-[#151c2f] rounded-xl border border-white/5 p-6">
                                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                        <ShieldAlert size={18} className="text-purple-400" /> Seguridad & Reglas
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-[#0b0f19] rounded-lg border border-white/5">
                                            <div>
                                                <div className="font-medium text-gray-200">Anti-Fraude (Device ID)</div>
                                                <div className="text-xs text-gray-500">Bloquea múltiples intentos desde el mismo dispositivo.</div>
                                            </div>
                                            <div 
                                                onClick={() => toggleSetting('antiFraud')}
                                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.antiFraud ? 'bg-cyan-500' : 'bg-gray-700'}`}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${settings.antiFraud ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-[#0b0f19] rounded-lg border border-white/5">
                                            <div>
                                                <div className="font-medium text-gray-200">Reposición Automática de Stock</div>
                                                <div className="text-xs text-gray-500">Añadir stock automáticamente cuando baje del 10%.</div>
                                            </div>
                                            <div 
                                                onClick={() => toggleSetting('autoStock')}
                                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.autoStock ? 'bg-cyan-500' : 'bg-gray-700'}`}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${settings.autoStock ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2 */}
                                <div className="bg-[#151c2f] rounded-xl border border-white/5 p-6">
                                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                        <Mail size={18} className="text-pink-400" /> Notificaciones & Integraciones
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-[#0b0f19] rounded-lg border border-white/5">
                                            <div>
                                                <div className="font-medium text-gray-200">Email a Ganadores</div>
                                                <div className="text-xs text-gray-500">Enviar cupón automáticamente por correo.</div>
                                            </div>
                                            <div 
                                                onClick={() => toggleSetting('emailNotifications')}
                                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.emailNotifications ? 'bg-cyan-500' : 'bg-gray-700'}`}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-[#0b0f19] rounded-lg border border-white/5">
                                            <div>
                                                <div className="font-medium text-gray-200">Integración WhatsApp API</div>
                                                <div className="text-xs text-gray-500">Conectar con Meta Business para mensajes directos.</div>
                                            </div>
                                            <div 
                                                onClick={() => toggleSetting('whatsappIntegration')}
                                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.whatsappIntegration ? 'bg-cyan-500' : 'bg-gray-700'}`}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${settings.whatsappIntegration ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <button className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </div>
                );

          default:
              return null;
      }
  };

  return (
    <div className="w-full h-[800px] bg-[#0b0f19] text-white overflow-hidden rounded-2xl flex font-sans border border-white/10 shadow-2xl relative">
        
        {/* MOBILE OVERLAY */}
        {mobileMenuOpen && (
            <div className="absolute inset-0 z-30 bg-black/80 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
        )}

        {/* SIDEBAR */}
        <div className={`absolute inset-y-0 left-0 z-40 w-64 bg-[#0f1423] border-r border-white/5 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 flex justify-between items-center">
                <div className="flex items-center gap-2 font-display font-bold text-xl tracking-wider text-white">
                    <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Zap size={18} className="text-white" fill="currentColor" />
                    </div>
                    CRM.io
                </div>
                <button className="md:hidden text-gray-400" onClick={() => setMobileMenuOpen(false)}><X size={20}/></button>
            </div>

            <div className="flex-1 px-4 space-y-1 overflow-y-auto">
                <div className="text-xs font-mono text-gray-500 px-4 py-2 uppercase">Principal</div>
                <SidebarItem 
                    icon={LayoutDashboard} 
                    label="Resumen" 
                    active={activeView === 'Resumen'} 
                    onClick={() => { setActiveView('Resumen'); setMobileMenuOpen(false); }}
                />
                <SidebarItem 
                    icon={Users} 
                    label="Leads" 
                    badge={leadsData.length > STATIC_WINNERS.length ? `${leadsData.length - STATIC_WINNERS.length} New` : undefined} 
                    active={activeView === 'Leads'} 
                    onClick={() => { setActiveView('Leads'); setMobileMenuOpen(false); }}
                />
                <SidebarItem 
                    icon={Box} 
                    label="Premios / Stock" 
                    active={activeView === 'Premios'} 
                    onClick={() => { setActiveView('Premios'); setMobileMenuOpen(false); }}
                />
                <SidebarItem 
                    icon={Ticket} 
                    label="Cupones" 
                    active={activeView === 'Cupones'} 
                    onClick={() => { setActiveView('Cupones'); setMobileMenuOpen(false); }}
                />
                
                <div className="text-xs font-mono text-gray-500 px-4 py-2 mt-6 uppercase">Sistema</div>
                <SidebarItem 
                    icon={Settings} 
                    label="Configuración" 
                    active={activeView === 'Configuracion'} 
                    onClick={() => { setActiveView('Configuracion'); setMobileMenuOpen(false); }}
                />
                <SidebarItem 
                    icon={LogOut} 
                    label="Cerrar Sesión" 
                    onClick={() => window.location.reload()}
                />
            </div>

            {/* Support Widget */}
            <div className="p-4">
                <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 border border-white/5 rounded-xl p-4 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl -z-10"></div>
                     <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <LifeBuoy size={18} className="text-cyan-300" />
                        </div>
                        <span className="font-bold text-sm">¿Ayuda?</span>
                     </div>
                     <p className="text-xs text-gray-400 mb-3">Contacta a soporte técnico para integraciones.</p>
                     <button className="w-full py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors shadow-lg">
                         Soporte AI
                     </button>
                </div>
            </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0b0f19] relative">
            
            {/* TOP BAR */}
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0f1423]/50 backdrop-blur-sm sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <button className="md:hidden p-2 text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(true)}>
                        <Menu size={20} />
                    </button>
                    <div>
                        <h2 className="text-lg font-bold">{activeView}</h2>
                        <p className="text-xs text-gray-400">Bienvenido de nuevo, Admin.</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative hidden md:block group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar leads, premios..." 
                            className="bg-[#151c2f] border border-white/5 rounded-full pl-10 pr-4 py-2 text-sm text-gray-300 focus:border-cyan-500 outline-none w-64 transition-all focus:w-72 focus:bg-[#0b0f19]"
                        />
                    </div>
                    
                    {/* Notifications */}
                    <div className="relative">
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={`relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5 ${showNotifications ? 'bg-white/5 text-white' : ''}`}
                        >
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#0f1423]"></span>
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 top-full mt-2 w-80 bg-[#151c2f] border border-white/10 rounded-xl shadow-2xl z-50 animate-in zoom-in-95 duration-200">
                                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                                    <h4 className="font-bold text-sm">Notificaciones</h4>
                                    <span className="text-xs text-cyan-400 cursor-pointer hover:underline">Marcar leídas</span>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.map(notif => (
                                        <div key={notif.id} className="p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer flex gap-3">
                                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${notif.type === 'warning' ? 'bg-orange-500' : notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                                            <p className="text-sm text-gray-300 leading-snug">{notif.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 p-[2px] cursor-pointer hover:scale-110 transition-transform">
                        <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="rounded-full w-full h-full object-cover border-2 border-[#0b0f19]" />
                    </div>
                </div>
            </header>

            {/* DASHBOARD CONTENT */}
            {renderContent()}
        </div>
    </div>
  );
};

export default CRMTool;
