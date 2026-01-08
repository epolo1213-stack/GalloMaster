
import React, { useState } from 'react';
import { Bird, BreedingPair, Gender, IncubationMethod } from '../types';
import { Dna, Heart, Calendar, Star, X, Egg, Thermometer, Home, Info, ChevronRight, AlertCircle, Clock, CheckCircle2, Zap } from 'lucide-react';

interface BreedingCenterProps {
  birds: Bird[];
  pairs: BreedingPair[];
  onAddPair: (pair: BreedingPair) => void;
}

const BreedingCenter: React.FC<BreedingCenterProps> = ({ birds, pairs, onAddPair }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPair, setSelectedPair] = useState<BreedingPair | null>(null);
  const [newPair, setNewPair] = useState<Partial<BreedingPair>>({
    isIncubating: false,
    eggsLaid: 0,
    eggsIncubating: 0,
    incubationMethod: 'Natural'
  });

  const males = birds.filter(b => b.gender === Gender.MALE && b.status !== 'Muerto');
  const females = birds.filter(b => b.gender === Gender.FEMALE && b.status !== 'Muerto');

  const calculateHatchDate = (startDate: string) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + 21);
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPair.maleId || !newPair.femaleId || !newPair.startDate) return;

    const hatchDate = newPair.isIncubating && newPair.incubationStartDate 
      ? calculateHatchDate(newPair.incubationStartDate) 
      : undefined;

    const pair: BreedingPair = {
      id: Math.random().toString(36).substr(2, 9),
      maleId: newPair.maleId,
      femaleId: newPair.femaleId,
      startDate: newPair.startDate,
      eggsLaid: newPair.eggsLaid || 0,
      hatchedCount: 0,
      status: 'Activa',
      isIncubating: newPair.isIncubating || false,
      incubationMethod: newPair.incubationMethod as IncubationMethod,
      incubationStartDate: newPair.incubationStartDate,
      expectedHatchDate: hatchDate,
      eggsIncubating: newPair.eggsIncubating || 0
    };
    
    onAddPair(pair);
    setIsModalOpen(false);
  };

  const totalIncubating = pairs.reduce((acc, p) => acc + (p.eggsIncubating || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Centro de Genética y Reproducción</h1>
          <p className="text-slate-400 text-sm">Control total de linajes, cruces e incubación.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
        >
          <PlusIcon /> Nuevo Cruce / Nidada
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          icon={<Egg className="text-amber-500" />} 
          label="Huevos en Incubación" 
          value={totalIncubating} 
          sub="Total en granja"
        />
        <StatCard 
          icon={<Heart className="text-rose-500" />} 
          label="Parejas Activas" 
          value={pairs.length} 
          sub="En proceso de cría"
        />
        <StatCard 
          icon={<Star className="text-indigo-500" />} 
          label="Sementales" 
          value={males.length} 
          sub="Listos para cruce"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar size={20} className="text-slate-500" /> Seguimiento de Nidadas
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            {pairs.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                <Dna size={48} className="text-slate-800 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No hay registros de cría activos.</p>
              </div>
            ) : (
              pairs.map(pair => (
                <PairIncubationCard 
                  key={pair.id} 
                  pair={pair} 
                  birds={birds} 
                  onDetail={() => setSelectedPair(pair)}
                />
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Star size={20} className="text-amber-500" /> Sementales Élite
          </h3>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            {males.slice(0, 4).map((bird) => (
              <div key={bird.id} className="flex items-center gap-4 p-3 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:border-amber-500/30 transition-all cursor-pointer group">
                <img src={bird.image} className="w-12 h-12 rounded-lg object-cover border border-slate-700" />
                <div className="flex-1">
                  <h4 className="font-bold text-xs text-white group-hover:text-amber-500 transition-colors">{bird.name}</h4>
                  <p className="text-[10px] text-slate-500 uppercase font-black">{bird.breed}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <CreatePairModal 
          onClose={() => setIsModalOpen(false)} 
          males={males} 
          females={females} 
          handleSubmit={handleSubmit}
          newPair={newPair}
          setNewPair={setNewPair}
        />
      )}

      {selectedPair && (
        <ClutchDetailModal 
          pair={selectedPair} 
          birds={birds} 
          onClose={() => setSelectedPair(null)} 
        />
      )}
    </div>
  );
};

const PairIncubationCard: React.FC<{ pair: BreedingPair, birds: Bird[], onDetail: () => void }> = ({ pair, birds, onDetail }) => {
  const male = birds.find(b => b.id === pair.maleId);
  const female = birds.find(b => b.id === pair.femaleId);

  const getProgress = () => {
    if (!pair.incubationStartDate || !pair.expectedHatchDate) return 0;
    const start = new Date(pair.incubationStartDate).getTime();
    const end = new Date(pair.expectedHatchDate).getTime();
    const now = new Date().getTime();
    if (now < start) return 0;
    if (now > end) return 100;
    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  };

  const daysLeft = () => {
    if (!pair.expectedHatchDate) return null;
    const end = new Date(pair.expectedHatchDate).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const progress = getProgress();
  const remaining = daysLeft();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all shadow-lg group">
      <div className="p-5 flex flex-col md:flex-row items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="text-center">
            <img src={male?.image} className="w-14 h-14 rounded-full object-cover border-2 border-blue-500/20 mb-2" />
            <p className="text-[10px] font-bold text-blue-400">{male?.name}</p>
          </div>
          <Heart size={16} className="text-rose-500" />
          <div className="text-center">
            <img src={female?.image} className="w-14 h-14 rounded-full object-cover border-2 border-pink-500/20 mb-2" />
            <p className="text-[10px] font-bold text-pink-400">{female?.name}</p>
          </div>
        </div>

        <div className="flex-1 space-y-3 w-full">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${pair.status === 'Activa' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>
                  {pair.status}
                </span>
                <p className="text-xs text-slate-400 font-medium">Inicio: {pair.startDate}</p>
              </div>
              <h4 className="text-white font-bold mt-1">{male?.breed} x {female?.breed}</h4>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-white">{pair.eggsIncubating}</p>
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Huevos</p>
            </div>
          </div>

          {pair.isIncubating && (
            <div className="space-y-2">
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className={`h-full transition-all duration-1000 ${progress === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase">
                <span>{pair.incubationMethod}</span>
                <span className="text-amber-500">{remaining !== null && remaining > 0 ? `Faltan ${remaining} días` : 'Eclosión'}</span>
              </div>
            </div>
          )}
        </div>
        
        <button 
          onClick={onDetail}
          className="p-3 bg-slate-800 hover:bg-indigo-600 rounded-xl text-slate-400 hover:text-white transition-all shadow-lg"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

const ClutchDetailModal: React.FC<{ pair: BreedingPair, birds: Bird[], onClose: () => void }> = ({ pair, birds, onClose }) => {
  const male = birds.find(b => b.id === pair.maleId);
  const female = birds.find(b => b.id === pair.femaleId);

  const getDaysElapsed = () => {
    if (!pair.incubationStartDate) return 0;
    const start = new Date(pair.incubationStartDate).getTime();
    const now = new Date().getTime();
    const diff = now - start;
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  const daysElapsed = getDaysElapsed();
  const progress = Math.min(100, Math.round((daysElapsed / 21) * 100));

  const milestones = [
    { day: 1, label: 'Postura/Inicio', icon: <Egg size={14}/> },
    { day: 7, label: '1ra Ovoscopía', icon: <Info size={14}/> },
    { day: 14, label: '2da Ovoscopía', icon: <CheckCircle2 size={14}/> },
    { day: 18, label: 'Fin de Volteo', icon: <Zap size={14}/> },
    { day: 21, label: 'Eclosión', icon: <Star size={14}/> },
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-[60] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-indigo-950/30 to-slate-900">
          <div>
            <h2 className="text-2xl font-black text-white">Resumen de Nidada</h2>
            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Expediente Genético GM-{pair.id.toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white p-2 rounded-full hover:bg-slate-800"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {/* Header de la Nidada */}
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between bg-slate-800/30 p-6 rounded-3xl border border-slate-800">
             <div className="flex items-center gap-6">
                <div className="text-center group">
                  <img src={male?.image} className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500/20 group-hover:scale-105 transition-transform" />
                  <p className="text-[10px] font-black text-slate-500 mt-2 uppercase">Padre: {male?.name}</p>
                </div>
                <Heart className="text-rose-500" size={24} />
                <div className="text-center group">
                  <img src={female?.image} className="w-20 h-20 rounded-2xl object-cover border-2 border-pink-500/20 group-hover:scale-105 transition-transform" />
                  <p className="text-[10px] font-black text-slate-500 mt-2 uppercase">Madre: {female?.name}</p>
                </div>
             </div>
             <div className="text-center md:text-right">
                <p className="text-4xl font-black text-white">{pair.eggsIncubating}</p>
                <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Huevos en curso</p>
                <p className="text-[10px] text-slate-500 mt-1">Método: {pair.incubationMethod}</p>
             </div>
          </div>

          {/* Timeline de 21 Días */}
          <section className="space-y-6">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <Clock size={20} className="text-amber-500" /> Línea de Tiempo (21 Días)
            </h3>
            
            <div className="relative pt-8 pb-12 px-4">
              <div className="h-2 w-full bg-slate-800 rounded-full relative">
                <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-1000" style={{ width: `${progress}%` }} />
                
                {milestones.map((m, i) => (
                  <div 
                    key={i} 
                    className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center" 
                    style={{ left: `${(m.day / 21) * 100}%` }}
                  >
                    <div className={`w-4 h-4 rounded-full border-4 border-slate-900 ${daysElapsed >= m.day ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]' : 'bg-slate-700'}`} />
                    <div className="absolute top-6 whitespace-nowrap text-center">
                       <p className={`text-[9px] font-black uppercase ${daysElapsed >= m.day ? 'text-indigo-400' : 'text-slate-600'}`}>{m.label}</p>
                       <p className="text-[8px] text-slate-500">Día {m.day}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
               <InfoCard 
                  icon={<Calendar className="text-indigo-400"/>} 
                  label="Inició el" 
                  value={pair.incubationStartDate || 'N/A'} 
               />
               <InfoCard 
                  icon={<Zap className="text-amber-400"/>} 
                  label="Eclosión Estimada" 
                  value={pair.expectedHatchDate || 'N/A'} 
               />
            </div>
          </section>

          {/* Consejos de Etapa */}
          <section className="bg-indigo-600/5 border border-indigo-500/20 p-6 rounded-3xl space-y-4">
             <h4 className="text-indigo-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <AlertCircle size={16} /> Estado Actual: {daysElapsed} Días Transcurridos
             </h4>
             <p className="text-sm text-slate-300 leading-relaxed italic">
                {daysElapsed < 7 && "Etapa inicial. Mantén la temperatura estable a 37.7°C (99.9°F) y humedad al 50-55%. Evita aperturas innecesarias."}
                {daysElapsed >= 7 && daysElapsed < 14 && "Realiza la primera ovoscopía. Retira huevos no fértiles para evitar contaminación por gases."}
                {daysElapsed >= 14 && daysElapsed < 18 && "Desarrollo avanzado. Segunda ovoscopía. Los movimientos del pollo deben ser visibles."}
                {daysElapsed >= 18 && daysElapsed < 21 && "¡CRÍTICO! Detén el volteo de huevos. Sube la humedad al 70-75% para facilitar la rotura del cascarón."}
                {daysElapsed >= 21 && "Día de nacimiento. Mantén a los pollos en la incubadora hasta que estén completamente secos (aprox. 24h)."}
             </p>
          </section>
        </div>
      </div>
    </div>
  );
};

const CreatePairModal: React.FC<{ 
  onClose: () => void, 
  males: Bird[], 
  females: Bird[], 
  handleSubmit: (e: React.FormEvent) => void,
  newPair: Partial<BreedingPair>,
  setNewPair: (p: Partial<BreedingPair>) => void
}> = ({ onClose, males, females, handleSubmit, newPair, setNewPair }) => (
  <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-2xl my-auto shadow-2xl overflow-hidden">
      <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-slate-900 to-indigo-900/20">
        <div>
          <h2 className="text-2xl font-black text-white">Registrar Cruce</h2>
          <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Gestión de descendencia</p>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white p-2 rounded-full hover:bg-slate-800"><X size={24} /></button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Macho (Semental)</label>
            <select required className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white" onChange={e => setNewPair({...newPair, maleId: e.target.value})}>
              <option value="">Seleccionar Macho...</option>
              {males.map(m => <option key={m.id} value={m.id}>{m.name} ({m.plate})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Hembra (Gallina)</label>
            <select required className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white" onChange={e => setNewPair({...newPair, femaleId: e.target.value})}>
              <option value="">Seleccionar Hembra...</option>
              {females.map(f => <option key={f.id} value={f.id}>{f.name} ({f.plate})</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Fecha de Cruce</label>
            <input type="date" required className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white" onChange={e => setNewPair({...newPair, startDate: e.target.value})} />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Huevos Puestos</label>
            <input type="number" className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white" placeholder="0" onChange={e => setNewPair({...newPair, eggsLaid: parseInt(e.target.value)})} />
          </div>
        </div>

        <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><Egg size={20} /></div>
              <h4 className="font-bold text-white text-sm">¿Iniciar Incubación?</h4>
            </div>
            <input 
              type="checkbox" 
              className="w-5 h-5 accent-amber-500" 
              onChange={e => setNewPair({...newPair, isIncubating: e.target.checked})} 
            />
          </div>

          {newPair.isIncubating && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Método</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white" onChange={e => setNewPair({...newPair, incubationMethod: e.target.value as any})}>
                  <option value="Natural">Natural (Gallina)</option>
                  <option value="Incubadora">Incubadora (Artificial)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Huevos a Incubar</label>
                <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white" placeholder="Cantidad..." onChange={e => setNewPair({...newPair, eggsIncubating: parseInt(e.target.value)})} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Fecha Inicio de Incubación</label>
                <input type="date" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white" onChange={e => setNewPair({...newPair, incubationStartDate: e.target.value})} />
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 uppercase tracking-[0.2em] text-xs">Guardar Registro de Cría</button>
      </form>
    </div>
  </div>
);

const InfoCard: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 flex items-center gap-3">
    <div className="p-2 bg-slate-900 rounded-lg">{icon}</div>
    <div>
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-white">{value}</p>
    </div>
  </div>
);

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: number | string, sub: string }> = ({ icon, label, value, sub }) => (
  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 hover:border-slate-700 transition-all">
    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 shadow-inner">
      {icon}
    </div>
    <div>
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-tight">{label}</p>
      <p className="text-xl font-black text-white">{value}</p>
      <p className="text-[9px] text-slate-600 uppercase font-medium">{sub}</p>
    </div>
  </div>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default BreedingCenter;
