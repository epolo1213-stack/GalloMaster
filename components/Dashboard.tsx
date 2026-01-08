
import React, { useState } from 'react';
import { Bird as BirdType, BirdStatus, BreedingPair } from '../types';
import { 
  Users, 
  Activity, 
  Heart, 
  Flame, 
  ArrowUpRight, 
  AlertCircle, 
  Skull, 
  Egg, 
  X, 
  Calendar as CalendarIcon, 
  ChevronRight,
  Clock,
  Syringe,
  History
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Ene', pollos: 4, salud: 95 },
  { name: 'Feb', pollos: 7, salud: 90 },
  { name: 'Mar', pollos: 5, salud: 88 },
  { name: 'Abr', pollos: 12, salud: 92 },
  { name: 'May', pollos: 15, salud: 96 },
  { name: 'Jun', pollos: 10, salud: 94 },
];

interface DashboardProps {
  birds: BirdType[];
  pairs: BreedingPair[];
}

interface FarmEvent {
  id: string;
  date: string;
  type: 'Salud' | 'Cría';
  title: string;
  description: string;
  birdName?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ birds, pairs }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const activeBirds = birds.filter(b => b.status !== BirdStatus.DECEASED && b.status !== BirdStatus.SOLD);
  const sickBirds = birds.filter(b => b.status === BirdStatus.SICK);
  const deceasedCount = birds.filter(b => b.status === BirdStatus.DECEASED).length;
  const eggsIncubatingTotal = pairs.reduce((acc, p) => acc + (p.eggsIncubating || 0), 0);

  const stats = [
    { label: 'Plantel Activo', value: activeBirds.length, icon: <Users size={20} />, color: 'bg-blue-500', trend: `Total: ${birds.length}` },
    { label: 'En Entrenamiento', value: activeBirds.filter(b => b.status === BirdStatus.IN_TRAINING).length, icon: <Flame size={20} />, color: 'bg-orange-500', trend: 'Cuido' },
    { label: 'Huevos Incubando', value: eggsIncubatingTotal, icon: <Egg size={20} />, color: 'bg-amber-500', trend: 'Próximos' },
    { label: 'Promedio Peso', value: activeBirds.length > 0 ? `${(activeBirds.reduce((acc, b) => acc + b.weight, 0) / activeBirds.length).toFixed(2)} kg` : '0 kg', icon: <Activity size={20} />, color: 'bg-indigo-500', trend: 'Kg Activo' },
  ];

  // Consolidación de Eventos para el Calendario
  const getFarmEvents = (): FarmEvent[] => {
    const healthEvents: FarmEvent[] = birds.flatMap(bird => 
      bird.medicalHistory
        .filter(h => h.nextDose)
        .map(h => ({
          id: h.id,
          date: h.nextDose!,
          type: 'Salud',
          title: h.description,
          description: `Tratamiento/Vacuna programada`,
          birdName: bird.name
        }))
    );

    const breedingEvents: FarmEvent[] = pairs
      .filter(p => p.expectedHatchDate)
      .map(p => {
        const male = birds.find(b => b.id === p.maleId);
        const female = birds.find(b => b.id === p.femaleId);
        return {
          id: p.id,
          date: p.expectedHatchDate!,
          type: 'Cría',
          title: 'Eclosión Esperada',
          description: `${p.eggsIncubating} huevos en proceso`,
          birdName: `${male?.name || 'M'} x ${female?.name || 'H'}`
        };
      });

    return [...healthEvents, ...breedingEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const allEvents = getFarmEvents();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl group transition-all hover:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${stat.color} bg-opacity-10 text-slate-100 group-hover:scale-110 transition-transform`}>
                <div className={`${stat.color.replace('bg-', 'text-')}`}>{stat.icon}</div>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-800 text-slate-400 uppercase tracking-widest">{stat.trend}</span>
            </div>
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">{stat.label}</h3>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-bold text-lg">Crecimiento de Población</h3>
              <p className="text-slate-400 text-sm">Nacimientos registrados por mes</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPollos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="pollos" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorPollos)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><AlertCircle size={20} className="text-amber-500" /> Alertas Críticas</h3>
          <div className="space-y-4 flex-1">
            {sickBirds.length > 0 && (
              <DashboardAlert title={`${sickBirds.length} Ave(s) Enferma(s)`} group="Requiere Tratamiento" time="Inmediato" color="rose" />
            )}
            {deceasedCount > 0 && (
              <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skull className="text-slate-500" size={16} />
                  <p className="text-xs font-bold text-slate-300">{deceasedCount} Bajas registradas</p>
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Historial</span>
              </div>
            )}
            {allEvents.slice(0, 2).map((event, idx) => (
              <DashboardAlert 
                key={idx}
                title={event.title} 
                group={event.birdName || 'Varias Aves'} 
                time={event.date} 
                color={event.type === 'Salud' ? 'indigo' : 'amber'} 
              />
            ))}
          </div>
          <button 
            onClick={() => setIsCalendarOpen(true)}
            className="w-full mt-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-400 transition-colors uppercase tracking-widest border border-slate-700/50 flex items-center justify-center gap-2"
          >
            <CalendarIcon size={14} /> Calendario Completo
          </button>
        </div>
      </div>

      {/* Modal de Calendario Completo */}
      {isCalendarOpen && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-slate-900 to-indigo-900/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
                  <CalendarIcon size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Agenda de la Granja</h2>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Planificación y seguimiento</p>
                </div>
              </div>
              <button onClick={() => setIsCalendarOpen(false)} className="text-slate-500 hover:text-white p-2 rounded-full hover:bg-slate-800"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {allEvents.length === 0 ? (
                <div className="text-center py-20">
                  <History size={48} className="text-slate-800 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">No hay eventos programados en el horizonte.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {allEvents.map((event, i) => {
                    const eventDate = new Date(event.date);
                    const today = new Date();
                    const diffTime = eventDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div key={i} className="relative pl-8 before:absolute before:left-[11px] before:top-0 before:bottom-0 before:w-px before:bg-slate-800 last:before:hidden">
                        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-slate-900 flex items-center justify-center ${
                          event.type === 'Salud' ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                        }`}>
                          {event.type === 'Salud' ? <Syringe size={10} className="text-white" /> : <Egg size={10} className="text-slate-950" />}
                        </div>
                        
                        <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl hover:border-slate-600 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                event.type === 'Salud' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-amber-500/10 text-amber-500'
                              }`}>
                                {event.type}
                              </span>
                              <span className="text-[10px] text-slate-500 font-bold">{event.date}</span>
                            </div>
                            <h4 className="text-white font-bold text-sm">{event.title}</h4>
                            <p className="text-xs text-slate-400">{event.description} • <span className="text-slate-300">{event.birdName}</span></p>
                          </div>
                          
                          <div className="text-right">
                             <div className="flex items-center gap-2 text-amber-500 font-black text-xs uppercase bg-amber-500/5 px-3 py-1.5 rounded-xl border border-amber-500/10">
                                <Clock size={12} />
                                {diffDays === 0 ? 'Hoy' : diffDays < 0 ? 'Vencido' : `Faltan ${diffDays} días`}
                             </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-900/80 border-t border-slate-800 text-center">
               <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">GalloMaster Pro - Gestión de Tiempos Críticos</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardAlert: React.FC<{ title: string, group: string, time: string, color: string }> = ({ title, group, time, color }) => (
  <div className={`p-3 bg-${color}-500/5 border border-${color}-500/20 rounded-xl flex items-center justify-between transition-colors hover:bg-slate-800/50`}>
    <div>
      <p className={`text-xs font-bold text-${color}-200`}>{title}</p>
      <p className="text-[10px] text-slate-500 mt-0.5 uppercase truncate w-32">{group}</p>
    </div>
    <span className={`text-[10px] font-bold text-${color}-400 bg-${color}-500/10 px-2 py-0.5 rounded whitespace-nowrap`}>{time}</span>
  </div>
);

export default Dashboard;
