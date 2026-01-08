
import React, { useState } from 'react';
import { Bird, MedicalRecord, BirdStatus } from '../types';
import { 
  Shield, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Search, 
  Activity, 
  History, 
  Calendar,
  Syringe,
  Pill,
  Droplets,
  Bell,
  AlertCircle
} from 'lucide-react';

interface HealthManagerProps {
  birds: Bird[];
  onUpdateBird: (bird: Bird) => void;
}

const HealthManager: React.FC<HealthManagerProps> = ({ birds, onUpdateBird }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBirds, setSelectedBirds] = useState<string[]>([]);
  const [newRecord, setNewRecord] = useState<Partial<MedicalRecord>>({
    type: 'Vacuna',
    date: new Date().toISOString().split('T')[0],
    description: '',
    nextDose: ''
  });

  // Estadísticas Dinámicas
  const sickBirds = birds.filter(b => b.status === BirdStatus.SICK);
  const totalBirds = birds.length;
  
  const immunizedBirds = birds.filter(b => 
    b.medicalHistory.some(record => {
      const recordDate = new Date(record.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return recordDate >= thirtyDaysAgo;
    })
  );

  const immunizedPercent = totalBirds > 0 ? Math.round((immunizedBirds.length / totalBirds) * 100) : 0;

  // Cálculo de Alertas Críticas (Hoy o Vencidas)
  const today = new Date().toISOString().split('T')[0];
  const criticalAlerts = birds.flatMap(b => 
    b.medicalHistory
      .filter(h => h.nextDose && h.nextDose <= today)
      .map(h => ({ ...h, birdName: b.name, birdPlate: b.plate }))
  ).sort((a, b) => (a.nextDose! > b.nextDose! ? 1 : -1));

  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBirds.length === 0 || !newRecord.description) return;

    selectedBirds.forEach(birdId => {
      const bird = birds.find(b => b.id === birdId);
      if (bird) {
        const medicalRecord: MedicalRecord = {
          id: Math.random().toString(36).substr(2, 9),
          date: newRecord.date || new Date().toISOString().split('T')[0],
          type: newRecord.type as any,
          description: newRecord.description || '',
          nextDose: newRecord.nextDose || undefined
        };

        const updatedBird = {
          ...bird,
          medicalHistory: [medicalRecord, ...bird.medicalHistory]
        };
        onUpdateBird(updatedBird);
      }
    });

    setIsModalOpen(false);
    setSelectedBirds([]);
    setNewRecord({ type: 'Vacuna', date: new Date().toISOString().split('T')[0], description: '', nextDose: '' });
  };

  const toggleBirdSelection = (id: string) => {
    setSelectedBirds(prev => 
      prev.includes(id) ? prev.filter(bid => bid !== id) : [...prev, id]
    );
  };

  const recentActivity = birds
    .flatMap(b => b.medicalHistory.map(h => ({ ...h, birdName: b.name, birdPlate: b.plate })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      {/* Alerta de Salud Crítica */}
      {criticalAlerts.length > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500 rounded-lg text-white">
              <Bell size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Atención Médica Pendiente</p>
              <p className="text-xs text-rose-400">Hay {criticalAlerts.length} aves que requieren desparasitación o medicación hoy.</p>
            </div>
          </div>
          <button 
            onClick={() => {
              const ids = Array.from(new Set(criticalAlerts.map(a => birds.find(b => b.plate === a.birdPlate)?.id).filter(id => id !== undefined))) as string[];
              setSelectedBirds(ids);
              setIsModalOpen(true);
            }}
            className="text-[10px] font-bold bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg uppercase transition-all"
          >
            Atender Ahora
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Salud y Bienestar</h1>
          <p className="text-slate-400 text-sm">Control preventivo, vacunación y expedientes médicos.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Nueva Jornada Médica
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <HealthStatCard 
              label="Inmunizados" 
              value={`${immunizedPercent}%`} 
              sub="Protección 30d" 
              icon={<Shield className="text-emerald-500" />} 
              color="emerald"
            />
            <HealthStatCard 
              label="En Cuarentena" 
              value={sickBirds.length} 
              sub="Aves enfermas" 
              icon={<AlertTriangle className="text-rose-500" />} 
              color="rose"
            />
            <HealthStatCard 
              label="Pendientes" 
              value={birds.length - immunizedBirds.length} 
              sub="Sin vacuna reciente" 
              icon={<Clock className="text-amber-500" />} 
              color="amber"
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-800/20">
              <h3 className="text-white font-bold flex items-center gap-2">
                <History size={18} className="text-slate-400" /> Actividad Médica Reciente
              </h3>
            </div>
            <div className="divide-y divide-slate-800">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-slate-800 rounded-lg">
                        {activity.type === 'Vacuna' ? <Syringe size={16} className="text-indigo-400" /> : <Pill size={16} className="text-emerald-400" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{activity.description}</p>
                        <p className="text-[10px] text-slate-500 uppercase">{activity.birdName} ({activity.birdPlate}) • {activity.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold">{activity.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-600 italic text-sm">No hay registros médicos recientes.</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-amber-500" /> Próximas Citas
            </h3>
            <div className="space-y-4">
              {birds.flatMap(b => b.medicalHistory.filter(h => h.nextDose && h.nextDose > today)).sort((a,b) => (a.nextDose! > b.nextDose! ? 1 : -1)).slice(0, 4).map((rem, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <div>
                    <p className="text-xs font-bold text-white truncate w-32">{rem.description}</p>
                    <p className="text-[10px] text-slate-500 font-bold">{rem.nextDose}</p>
                  </div>
                  <span className="ml-auto text-[9px] font-black text-slate-600 uppercase">Aviso</span>
                </div>
              ))}
              {birds.flatMap(b => b.medicalHistory.filter(h => h.nextDose)).length === 0 && (
                <p className="text-[10px] text-slate-600 italic">No hay recordatorios pendientes.</p>
              )}
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl mt-4">
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Activity size={12} /> Tip Salud
                </p>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "La desparasitación interna cada 3 meses garantiza que los nutrientes lleguen al músculo."
                </p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-2xl shadow-xl">
             <h4 className="text-indigo-400 text-xs font-bold uppercase mb-2">Estado de Inmunidad</h4>
             <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-black text-white">{immunizedPercent}%</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-tighter">Meta: 95%</span>
             </div>
             <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${immunizedPercent}%` }} />
             </div>
          </div>
        </div>
      </div>

      {/* Modal Nueva Jornada Médica */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-emerald-950/30 to-slate-900">
              <div>
                <h2 className="text-2xl font-black text-white">Nueva Jornada Médica</h2>
                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mt-1">Registrar tratamientos en masa</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white p-2 rounded-full hover:bg-slate-800"><X size={24} /></button>
            </div>

            <form onSubmit={handleBatchSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Tipo de Acción</label>
                  <select 
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                    onChange={e => setNewRecord({...newRecord, type: e.target.value as any})}
                  >
                    <option value="Vacuna">Vacunación</option>
                    <option value="Tratamiento">Tratamiento Médico</option>
                    <option value="Desparasitación">Desparasitación</option>
                    <option value="Otro">Otro (Vitaminas/Refuerzos)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Fecha de Aplicación</label>
                  <input 
                    type="date" 
                    required 
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500" 
                    value={newRecord.date}
                    onChange={e => setNewRecord({...newRecord, date: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Descripción / Medicamento</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Eje: Ivermectina, Newcastle..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                    onChange={e => setNewRecord({...newRecord, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Próxima Dosis (Aviso)</label>
                  <input 
                    type="date" 
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                    onChange={e => setNewRecord({...newRecord, nextDose: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Seleccionar Aves ({selectedBirds.length})</label>
                <div className="relative mb-4">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Buscar por placa o nombre..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 custom-scrollbar">
                  {birds.filter(b => 
                    b.plate.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    b.name.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map(bird => (
                    <div 
                      key={bird.id}
                      onClick={() => toggleBirdSelection(bird.id)}
                      className={`p-2 rounded-xl border text-[10px] font-bold cursor-pointer transition-all flex items-center justify-between ${
                        selectedBirds.includes(bird.id) 
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <span className="truncate">{bird.name} ({bird.plate})</span>
                      {selectedBirds.includes(bird.id) && <CheckCircle2 size={12} />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-emerald-600/20 uppercase tracking-[0.2em] text-xs">
                  Guardar Jornada Médica
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const HealthStatCard: React.FC<{ label: string, value: string | number, sub: string, icon: React.ReactNode, color: string }> = ({ label, value, sub, icon, color }) => (
  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all">
    <div className={`p-3 bg-${color}-500/10 rounded-xl w-fit mb-4 border border-${color}-500/20`}>
      {icon}
    </div>
    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{label}</p>
    <p className="text-2xl font-black text-white mt-1">{value}</p>
    <p className={`text-[9px] text-${color}-500 uppercase font-bold mt-1`}>{sub}</p>
  </div>
);

export default HealthManager;
