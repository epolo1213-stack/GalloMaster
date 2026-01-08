
import React, { useState } from 'react';
import { Bird, TrainingLog } from '../types';
import { Swords, Zap, Timer, Trophy, Calendar, X, TrendingUp, TrendingDown, Target, ShieldCheck, Medal } from 'lucide-react';

interface TrainingCenterProps {
  birds: Bird[];
  logs: TrainingLog[];
  onAddLog: (log: TrainingLog) => void;
}

const TrainingCenter: React.FC<TrainingCenterProps> = ({ birds, logs, onAddLog }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLog, setNewLog] = useState<Partial<TrainingLog>>({
    activity: 'Vuelos',
    duration: 15,
    intensity: 'Media',
    result: undefined
  });

  const totalWins = birds.reduce((acc, b) => acc + (b.wins || 0), 0);
  const totalLosses = birds.reduce((acc, b) => acc + (b.losses || 0), 0);
  const totalTopas = logs.filter(l => l.activity === 'Topa (Entrenamiento)').length;
  const inTrainingCount = birds.filter(b => b.status === 'En Entrenamiento').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.birdId) return;
    const log: TrainingLog = {
      id: Math.random().toString(36).substr(2, 9),
      birdId: newLog.birdId,
      date: new Date().toLocaleDateString(),
      activity: newLog.activity!,
      duration: newLog.duration!,
      intensity: newLog.intensity! as 'Baja' | 'Media' | 'Alta',
      result: (newLog.activity === 'Combate (Oficial)' || newLog.activity === 'Topa (Entrenamiento)') ? newLog.result : undefined
    };
    onAddLog(log);
    setIsModalOpen(false);
    setNewLog({ activity: 'Vuelos', duration: 15, intensity: 'Media' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Centro de Entrenamiento</h1>
          <p className="text-slate-400 text-sm">Gestión separada de preparación y récords oficiales.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-600/20 transition-all"
        >
          <PlusIcon /> Registrar Actividad
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TrainingCard icon={<ShieldCheck className="text-cyan-400" />} label="Topas de Sparring" value={totalTopas.toString()} color="text-cyan-400" />
        <TrainingCard icon={<Medal className="text-emerald-500" />} label="Victorias (Oficial)" value={totalWins.toString()} color="text-emerald-400" />
        <TrainingCard icon={<Target className="text-rose-500" />} label="Derrotas (Oficial)" value={totalLosses.toString()} color="text-rose-400" />
        <TrainingCard icon={<Swords className="text-amber-500" />} label="En Preparación" value={inTrainingCount.toString()} color="text-amber-400" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 bg-slate-800/20 flex items-center justify-between">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Calendar size={18} className="text-slate-500" /> Historial de Actividad
          </h3>
          <div className="flex gap-4 text-[10px] uppercase font-bold tracking-widest">
            <span className="flex items-center gap-1.5 text-cyan-400"><div className="w-2 h-2 rounded-full bg-cyan-400" /> Topa</span>
            <span className="flex items-center gap-1.5 text-amber-500"><div className="w-2 h-2 rounded-full bg-amber-500" /> Combate</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Ave</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Tipo de Acción</th>
                <th className="px-6 py-4">Intensidad</th>
                <th className="px-6 py-4">Resultado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {logs.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500 text-sm italic">No hay registros aún.</td></tr>
              ) : (
                logs.map((log) => {
                  const bird = birds.find(b => b.id === log.birdId);
                  const isCombate = log.activity === 'Combate (Oficial)';
                  const isTopa = log.activity === 'Topa (Entrenamiento)';
                  
                  return (
                    <tr key={log.id} className={`hover:bg-slate-800/30 transition-colors ${isCombate ? 'bg-amber-500/[0.02]' : isTopa ? 'bg-cyan-500/[0.02]' : ''}`}>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img src={bird?.image} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                        <div>
                          <p className="text-xs font-bold text-white">{bird?.name}</p>
                          <p className="text-[10px] text-slate-500 uppercase">{bird?.plate}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">{log.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className={`text-[11px] font-black uppercase ${isCombate ? 'text-amber-500' : isTopa ? 'text-cyan-400' : 'text-slate-300'}`}>
                            {log.activity}
                          </span>
                          <span className="text-[9px] text-slate-500 font-medium">{log.duration} min de sesión</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.intensity === 'Alta' ? 'bg-orange-500/10 text-orange-500' : 
                          log.intensity === 'Media' ? 'bg-blue-500/10 text-blue-500' : 
                          'bg-slate-700/30 text-slate-400'
                        }`}>
                          {log.intensity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {log.result ? (
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase w-fit ${
                            log.result === 'Victoria' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                            log.result === 'Derrota' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 
                            'bg-slate-700 text-slate-300'
                          }`}>
                            {log.result}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">N/A</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-orange-950/20 to-slate-900">
              <div>
                <h2 className="text-xl font-bold text-white">Nueva Actividad</h2>
                <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest mt-1">Bitácora de desempeño</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Seleccionar Ave</label>
                <select required className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500" onChange={e => setNewLog({...newLog, birdId: e.target.value})}>
                  <option value="">Seleccionar gladiador...</option>
                  {birds.filter(b => b.status !== 'Muerto').map(b => <option key={b.id} value={b.id}>{b.name} ({b.plate})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Tipo de Acción</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500" onChange={e => setNewLog({...newLog, activity: e.target.value})}>
                  <option value="Vuelos">Vuelos / Aleteo</option>
                  <option value="Correr">Correr / Malla</option>
                  <option value="Topa (Entrenamiento)">Topa (Entrenamiento / Sparring)</option>
                  <option value="Combate (Oficial)">Combate (Encuentro Oficial)</option>
                  <option value="Baño / Limpieza">Baño / Limpieza</option>
                </select>
              </div>

              {(newLog.activity === 'Combate (Oficial)' || newLog.activity === 'Topa (Entrenamiento)') && (
                <div className={`p-4 rounded-2xl border animate-in slide-in-from-top-2 ${newLog.activity === 'Combate (Oficial)' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-cyan-500/5 border-cyan-500/20'}`}>
                  <label className={`block text-[10px] font-black uppercase mb-3 text-center ${newLog.activity === 'Combate (Oficial)' ? 'text-amber-500' : 'text-cyan-400'}`}>
                    Resultado del {newLog.activity === 'Combate (Oficial)' ? 'Combate' : 'Sparring'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Victoria', 'Derrota', 'Tabla'].map((res) => (
                      <button
                        key={res}
                        type="button"
                        onClick={() => setNewLog({...newLog, result: res as any})}
                        className={`py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${
                          newLog.result === res 
                            ? res === 'Victoria' ? 'bg-emerald-500 text-white border-emerald-500' : res === 'Derrota' ? 'bg-rose-500 text-white border-rose-500' : 'bg-slate-600 text-white border-slate-600'
                            : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-600'
                        }`}
                      >
                        {res}
                      </button>
                    ))}
                  </div>
                  {newLog.activity === 'Combate (Oficial)' && (
                    <p className="text-[8px] text-amber-600 font-bold text-center mt-3 uppercase tracking-tighter">⚠️ Este resultado afectará el récord oficial del ave</p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Duración (min)</label>
                  <input type="number" className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white" defaultValue={15} onChange={e => setNewLog({...newLog, duration: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Intensidad</label>
                  <select className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white" onChange={e => setNewLog({...newLog, intensity: e.target.value as any})}>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-orange-600/20 uppercase tracking-widest text-xs mt-2">
                Guardar Reporte
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const TrainingCard: React.FC<{ icon: React.ReactNode, label: string, value: string, color: string }> = ({ icon, label, value, color }) => (
  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all group">
    <div className={`mb-4 p-3 rounded-xl bg-slate-800/50 w-fit group-hover:scale-110 transition-transform ${color}`}>
      {icon}
    </div>
    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{label}</p>
    <p className="text-2xl font-black text-white mt-1">{value}</p>
  </div>
);

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default TrainingCenter;
