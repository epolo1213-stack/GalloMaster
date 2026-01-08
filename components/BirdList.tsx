
import React, { useState, useRef } from 'react';
import { Bird as BirdType, BirdStatus, Gender, TrainingLog } from '../types';
import { Plus, X, Upload, Dna, Info, Calendar, Weight, Save, AlertTriangle, Trophy, FileText, Printer, ShieldCheck, Heart, Medal } from 'lucide-react';

interface BirdListProps {
  birds: BirdType[];
  onAddBird: (bird: BirdType) => void;
  onUpdateBird: (bird: BirdType) => void;
  trainingLogs?: TrainingLog[];
}

const BirdList: React.FC<BirdListProps> = ({ birds, onAddBird, onUpdateBird, trainingLogs = [] }) => {
  const [filter, setFilter] = useState<BirdStatus | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBird, setSelectedBird] = useState<BirdType | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newBird, setNewBird] = useState<Partial<BirdType>>({
    status: BirdStatus.ACTIVE,
    gender: Gender.MALE,
    breed: '',
    weight: 0,
    fatherId: '',
    motherId: '',
    wins: 0,
    losses: 0
  });

  const filteredBirds = filter === 'ALL' ? birds : birds.filter(b => b.status === filter);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setNewBird({ ...newBird, image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bird: BirdType = {
      ...newBird as BirdType,
      id: Math.random().toString(36).substr(2, 9),
      image: newBird.image || 'https://images.unsplash.com/photo-1598331668826-20cecc596b86?auto=format&fit=crop&q=80&w=400',
      medicalHistory: [],
      birthDate: new Date().toISOString().split('T')[0],
      notes: newBird.notes || '',
      wins: newBird.wins || 0,
      losses: newBird.losses || 0
    };
    onAddBird(bird);
    setIsModalOpen(false);
    setImagePreview(null);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventario de Aves</h1>
          <p className="text-slate-400 text-sm">Gestiona tu plantel con precisión genética.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-500/20"
        >
          <Plus size={18} /> Nueva Ave
        </button>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        {['ALL', ...Object.values(BirdStatus)].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
              filter === status 
                ? 'bg-amber-500 text-slate-950 border-amber-500' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            {status === 'ALL' ? 'Todos' : status}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBirds.map((bird) => (
          <div 
            key={bird.id} 
            onClick={() => setSelectedBird(bird)}
            className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all group cursor-pointer shadow-xl ${
              bird.status === BirdStatus.DECEASED || bird.status === BirdStatus.SOLD ? 'opacity-60 grayscale-[0.3]' : ''
            }`}
          >
            <div className="relative h-48">
              <img src={bird.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="bg-slate-950/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider">{bird.plate}</span>
                <span className={`bg-slate-950/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold ${bird.gender === Gender.MALE ? 'text-blue-400' : 'text-pink-400'}`}>{bird.gender}</span>
              </div>
              <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-2">
                 <Trophy size={12} className="text-emerald-500" />
                 <span className="text-xs font-black text-white">{bird.wins} <span className="text-slate-500 mx-0.5">-</span> {bird.losses}</span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-bold text-lg">{bird.name}</h3>
                  <p className="text-amber-500 text-xs font-bold uppercase tracking-widest">{bird.breed}</p>
                </div>
                <StatusBadge status={bird.status} />
              </div>
              <div className="flex items-center gap-2 mt-4 text-slate-400 text-xs font-medium">
                <Weight size={14} className="text-slate-500" />
                <span>{bird.weight} kg</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg my-auto shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Ficha de Registro</h2>
              <button onClick={() => { setIsModalOpen(false); setImagePreview(null); }} className="text-slate-500 hover:text-white p-1 rounded-full hover:bg-slate-800"><X size={22} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 h-32 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-800/50 flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/50 hover:bg-slate-800 transition-all overflow-hidden"
                >
                  {imagePreview ? (
                    <img src={imagePreview} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload size={24} className="text-slate-500 mb-2" />
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Subir Foto</span>
                    </>
                  )}
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup label="Nombre del Gallo" required placeholder="Eje: Relámpago" onChange={v => setNewBird({...newBird, name: v})} />
                <InputGroup label="Número de Placa" required placeholder="Eje: GM-2024" onChange={v => setNewBird({...newBird, plate: v})} />
                <InputGroup label="Línea / Raza" required placeholder="Eje: Kelso Pure" onChange={v => setNewBird({...newBird, breed: v})} />
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Peso (kg)</label>
                  <input step="0.01" type="number" required placeholder="0.00" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500" onChange={e => setNewBird({...newBird, weight: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Género</label>
                  <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white appearance-none" onChange={e => setNewBird({...newBird, gender: e.target.value as Gender})}>
                    <option value={Gender.MALE}>Macho (Gallo)</option>
                    <option value={Gender.FEMALE}>Hembra (Gallina)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Estado Inicial</label>
                  <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white appearance-none" onChange={e => setNewBird({...newBird, status: e.target.value as BirdStatus})}>
                    {Object.values(BirdStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Victorias Base</label>
                    <input type="number" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500" defaultValue={0} onChange={e => setNewBird({...newBird, wins: parseInt(e.target.value)})} />
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Derrotas Base</label>
                    <input type="number" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500" defaultValue={0} onChange={e => setNewBird({...newBird, losses: parseInt(e.target.value)})} />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Padre (Semental)</label>
                  <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white appearance-none" onChange={e => setNewBird({...newBird, fatherId: e.target.value})}>
                    <option value="">Desconocido</option>
                    {birds.filter(b => b.gender === Gender.MALE).map(b => <option key={b.id} value={b.id}>{b.name} ({b.plate})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Madre (Gallina)</label>
                  <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white appearance-none" onChange={e => setNewBird({...newBird, motherId: e.target.value})}>
                    <option value="">Desconocida</option>
                    {birds.filter(b => b.gender === Gender.FEMALE).map(b => <option key={b.id} value={b.id}>{b.name} ({b.plate})</option>)}
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-4 rounded-xl transition-all shadow-lg shadow-amber-500/20 uppercase tracking-widest text-sm">Registrar en Inventario</button>
            </form>
          </div>
        </div>
      )}

      {selectedBird && (
        <BirdDetailModal 
          bird={selectedBird} 
          birds={birds} 
          trainingLogs={trainingLogs}
          onClose={() => setSelectedBird(null)} 
          onUpdate={(updated) => {
            onUpdateBird(updated);
            setSelectedBird(updated);
          }}
        />
      )}
    </div>
  );
};

const InputGroup: React.FC<{ label: string, required?: boolean, placeholder: string, onChange: (v: string) => void }> = ({ label, required, placeholder, onChange }) => (
  <div className="no-print">
    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">{label} {required && '*'}</label>
    <input 
      required={required}
      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const StatusBadge: React.FC<{ status: BirdStatus }> = ({ status }) => {
  const configs = {
    [BirdStatus.ACTIVE]: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    [BirdStatus.IN_TRAINING]: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    [BirdStatus.BREEDING]: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    [BirdStatus.MOLTING]: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    [BirdStatus.SICK]: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    [BirdStatus.RETIRED]: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    [BirdStatus.SOLD]: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    [BirdStatus.DECEASED]: 'text-slate-100 bg-slate-950/40 border-slate-700/50',
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${configs[status]}`}>{status}</span>;
};

const BirdDetailModal: React.FC<{ bird: BirdType, birds: BirdType[], trainingLogs: TrainingLog[], onClose: () => void, onUpdate: (b: BirdType) => void }> = ({ bird, birds, trainingLogs, onClose, onUpdate }) => {
  const father = birds.find(b => b.id === bird.fatherId);
  const mother = birds.find(b => b.id === bird.motherId);
  
  const birdLogs = trainingLogs.filter(log => log.birdId === bird.id);

  const handleStatusChange = (newStatus: BirdStatus) => {
    onUpdate({ ...bird, status: newStatus });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-[60] flex items-center justify-center p-4 modal-backdrop">
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300 no-print modal-container">
        <div className="relative h-64 flex-shrink-0">
          <img src={bird.image} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          <div className="absolute top-6 right-6 flex gap-3">
             <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black uppercase shadow-xl transition-all"
             >
                <FileText size={16} /> Generar Dossier PDF
             </button>
             <button onClick={onClose} className="p-2 bg-slate-900/50 backdrop-blur-md rounded-full text-white hover:bg-slate-800 transition-colors"><X size={24} /></button>
          </div>
          
          <div className="absolute bottom-6 left-8 right-8 flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-black text-white">{bird.name}</h2>
                <div className="bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-xl flex items-center gap-2">
                   <Trophy size={14} className="text-emerald-500" />
                   <span className="text-sm font-black text-white">{bird.wins} <span className="text-slate-500">-</span> {bird.losses}</span>
                </div>
              </div>
              <p className="text-amber-500 font-bold uppercase tracking-[0.2em] text-sm">{bird.breed}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cambiar Estado</label>
               <select 
                value={bird.status}
                onChange={(e) => handleStatusChange(e.target.value as BirdStatus)}
                className={`bg-slate-950/60 backdrop-blur-md border border-slate-700 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:border-amber-500 transition-all ${
                  bird.status === BirdStatus.DECEASED ? 'text-rose-400' : 'text-emerald-400'
                }`}
               >
                 {Object.values(BirdStatus).map(s => <option key={s} value={s}>{s}</option>)}
               </select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar no-scrollbar">
          {bird.status === BirdStatus.DECEASED && (
            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center gap-3">
              <AlertTriangle className="text-rose-500" size={20} />
              <p className="text-sm text-rose-200 font-medium italic">Esta ave está marcada como fallecida. El registro se conserva para historial genético.</p>
            </div>
          )}

          <section>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
              <Info size={20} className="text-amber-500" /> Datos Generales
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <DetailCard label="Placa" value={bird.plate} icon={<Calendar size={14}/>} />
              <DetailCard label="Género" value={bird.gender} icon={<Info size={14}/>} />
              <DetailCard label="Peso Actual" value={`${bird.weight} kg`} icon={<Weight size={14}/>} />
              <DetailCard label="Línea" value={bird.breed} icon={<Dna size={14}/>} />
            </div>
          </section>

          <section>
            <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-lg">
              <Dna size={20} className="text-indigo-500" /> Pedigrí y Linaje
            </h3>
            <div className="relative flex flex-col gap-12 items-center">
              <div className="grid grid-cols-2 w-full gap-8 relative">
                <PedigreeBox bird={father} label="Padre (Semental)" side="male" />
                <PedigreeBox bird={mother} label="Madre (Gallina)" side="female" />
              </div>
            </div>
          </section>

          <section className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <h3 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">Notas del Criador</h3>
            <textarea 
              value={bird.notes}
              onChange={(e) => onUpdate({ ...bird, notes: e.target.value })}
              className="w-full bg-transparent border-none text-slate-400 text-sm italic focus:ring-0 p-0 resize-none min-h-[80px]"
              placeholder="Escribe notas sobre su desempeño, carácter o cuidados especiales..."
            />
          </section>
        </div>
      </div>

      {/* Versión para imprimir: Sólo visible al imprimir */}
      <div className="hidden print:block fixed inset-0 bg-white p-0 m-0 print-block overflow-visible">
        <div className="w-full max-w-[210mm] mx-auto p-12 bg-white text-slate-900 min-h-screen border-[12px] border-amber-500/10">
          <div className="flex justify-between items-start border-b-4 border-amber-500 pb-8 mb-10">
            <div>
              <h1 className="text-5xl font-black text-slate-950 uppercase leading-none">Certificado</h1>
              <p className="text-amber-600 font-black text-xl uppercase tracking-[0.2em] mt-2">Dossier de Desempeño Élite</p>
              <p className="text-slate-400 font-bold uppercase text-xs mt-1">Granja "El Centenario" • GalloMaster Pro</p>
            </div>
            <div className="text-right">
              <div className="bg-slate-950 text-white px-6 py-4 rounded-2xl mb-2">
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Placa Oficial</p>
                 <p className="text-2xl font-black text-amber-500">{bird.plate}</p>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Emisión: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-10 mb-10 items-center">
            <div className="col-span-2">
              <div className="border-4 border-amber-500 rounded-[2.5rem] overflow-hidden shadow-2xl rotate-[-2deg]">
                <img src={bird.image} className="w-full h-80 object-cover" />
              </div>
            </div>
            <div className="col-span-3 space-y-6">
              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
                <h2 className="text-4xl font-black text-slate-900 mb-2">{bird.name}</h2>
                <p className="text-amber-600 font-black text-lg uppercase tracking-widest mb-6 border-b border-amber-500/20 pb-4">{bird.breed}</p>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Peso en Registro</p>
                    <p className="text-xl font-bold text-slate-800">{bird.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Género</p>
                    <p className="text-xl font-bold text-slate-800">{bird.gender}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 bg-emerald-500 text-white p-6 rounded-3xl text-center shadow-lg shadow-emerald-500/20">
                  <p className="text-3xl font-black">{bird.wins}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Victorias</p>
                </div>
                <div className="flex-1 bg-rose-500 text-white p-6 rounded-3xl text-center shadow-lg shadow-rose-500/20">
                  <p className="text-3xl font-black">{bird.losses}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Derrotas</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 mb-10">
            <section>
              <h3 className="text-lg font-black uppercase text-slate-400 border-b-2 border-slate-100 pb-2 mb-4">Ascendencia Directa</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 font-black text-xs">P</div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Padre (Semental)</p>
                    <p className="font-bold text-slate-800">{father?.name || 'Registro Reservado'}</p>
                    <p className="text-[10px] text-slate-500">{father?.breed}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-500 font-black text-xs">M</div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Madre (Productora)</p>
                    <p className="font-bold text-slate-800">{mother?.name || 'Registro Reservado'}</p>
                    <p className="text-[10px] text-slate-500">{mother?.breed}</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-black uppercase text-slate-400 border-b-2 border-slate-100 pb-2 mb-4">Historial de Salud</h3>
              <div className="space-y-3">
                {bird.medicalHistory.length > 0 ? bird.medicalHistory.map(h => (
                  <div key={h.id} className="flex justify-between items-center py-2 border-b border-slate-100">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{h.description}</p>
                      <p className="text-[9px] text-slate-500 uppercase">{h.type}</p>
                    </div>
                    <p className="text-xs font-bold text-slate-400">{h.date}</p>
                  </div>
                )) : <p className="text-sm italic text-slate-400">Sin alertas médicas previas.</p>}
              </div>
            </section>
          </div>

          <section className="mb-10">
            <h3 className="text-lg font-black uppercase text-slate-400 border-b-2 border-slate-100 pb-2 mb-4">Registro de Desempeño Reciente</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200">
                <h4 className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-4">Combates Oficiales</h4>
                {birdLogs.filter(l => l.activity.includes('Combate')).length > 0 ? (
                  birdLogs.filter(l => l.activity.includes('Combate')).map(l => (
                    <div key={l.id} className="flex justify-between py-2 border-b border-amber-100 text-xs">
                      <span className="font-bold text-slate-700">{l.date}</span>
                      <span className={`font-black uppercase ${l.result === 'Victoria' ? 'text-emerald-600' : 'text-rose-600'}`}>{l.result}</span>
                    </div>
                  ))
                ) : <p className="text-[10px] italic text-amber-600">No hay combates registrados.</p>}
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Topas de Evaluación</h4>
                {birdLogs.filter(l => l.activity.includes('Topa')).length > 0 ? (
                  birdLogs.filter(l => l.activity.includes('Topa')).map(l => (
                    <div key={l.id} className="flex justify-between py-2 border-b border-slate-100 text-xs">
                      <span className="font-bold text-slate-700">{l.date}</span>
                      <span className="text-slate-500 font-bold uppercase">{l.intensity} ({l.duration}m)</span>
                    </div>
                  ))
                ) : <p className="text-[10px] italic text-slate-400">No hay topas registradas.</p>}
              </div>
            </div>
          </section>

          <div className="mt-16 text-center">
            <div className="flex justify-center mb-6">
               <ShieldCheck size={48} className="text-amber-500 opacity-20" />
            </div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.6em] mb-2">GalloMaster Pro - Verificado Digital</p>
            <p className="text-[8px] text-slate-300 uppercase italic">Este documento es una representación fiel de los registros digitales de la granja.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailCard: React.FC<{ label: string, value: string, icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1 flex items-center gap-1">{icon} {label}</p>
    <p className="text-white font-bold text-sm">{value}</p>
  </div>
);

const PedigreeBox: React.FC<{ bird?: BirdType, label: string, side: 'male' | 'female', mini?: boolean }> = ({ bird, label, side, mini }) => (
  <div className={`flex flex-col items-center gap-2 group transition-all ${mini ? 'scale-90' : ''}`}>
    <div className={`w-full p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center ${
      bird 
        ? side === 'male' ? 'border-blue-500/20 bg-blue-500/5' : 'border-pink-500/20 bg-pink-500/5'
        : 'border-slate-800 bg-slate-800/20 opacity-50'
    }`}>
      {bird ? (
        <>
          <img src={bird.image} className="w-16 h-16 rounded-xl object-cover mb-2 border border-slate-700 group-hover:scale-110 transition-transform shadow-lg shadow-black/40" />
          <p className="text-[10px] font-black uppercase text-slate-500 mb-1">{label}</p>
          <p className="text-white font-bold text-xs truncate w-full">{bird.name}</p>
          <p className="text-[10px] text-slate-400">{bird.plate}</p>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-24">
          <Dna size={20} className="text-slate-700 mb-2 opacity-50" />
          <p className="text-[10px] font-bold text-slate-600 uppercase">Sin Registro</p>
        </div>
      )}
    </div>
  </div>
);

export default BirdList;
