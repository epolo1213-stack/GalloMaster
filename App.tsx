
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Bird, 
  Dna, 
  Stethoscope, 
  Swords, 
  Plus, 
  Search,
  MessageSquareQuote,
  TrendingUp,
  Calendar,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Smartphone,
  Download
} from 'lucide-react';
import { Bird as BirdType, BirdStatus, Gender, BreedingPair, TrainingLog, MedicalRecord } from './types';
import Dashboard from './components/Dashboard';
import BirdList from './components/BirdList';
import BreedingCenter from './components/BreedingCenter';
import HealthManager from './components/HealthManager';
import TrainingCenter from './components/TrainingCenter';
import AIConsultant from './components/AIConsultant';
import Auth from './components/Auth';

const MOCK_BIRDS: BirdType[] = [
  {
    id: '1',
    plate: 'GM-1001',
    name: 'Relámpago',
    gender: Gender.MALE,
    breed: 'Kelso Pure',
    birthDate: '2023-05-15',
    weight: 2.25,
    status: BirdStatus.IN_TRAINING,
    wins: 3,
    losses: 0,
    image: 'https://images.unsplash.com/photo-1598331668826-20cecc596b86?auto=format&fit=crop&q=80&w=400',
    medicalHistory: [
      { id: 'h1', date: '2024-03-01', type: 'Vacuna', description: 'Newcastle Refuerzo' }
    ],
    notes: 'Semental prometedor, muy veloz.'
  },
  {
    id: '2',
    plate: 'GM-2005',
    name: 'Zafiro',
    gender: Gender.FEMALE,
    breed: 'Sweater',
    birthDate: '2022-11-20',
    weight: 1.80,
    status: BirdStatus.BREEDING,
    wins: 0,
    losses: 0,
    image: 'https://images.unsplash.com/photo-1628155100063-953b1b500366?auto=format&fit=crop&q=80&w=400',
    medicalHistory: [],
    notes: 'Madre de la camada A-2024.'
  }
];

const MOCK_PAIRS: BreedingPair[] = [
  { 
    id: 'p1', 
    maleId: '1', 
    femaleId: '2', 
    startDate: '2024-03-10', 
    eggsLaid: 6, 
    hatchedCount: 0, 
    status: 'Activa',
    isIncubating: false 
  }
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [birds, setBirds] = useState<BirdType[]>(MOCK_BIRDS);
  const [pairs, setPairs] = useState<BreedingPair[]>(MOCK_PAIRS);
  const [trainingLogs, setTrainingLogs] = useState<TrainingLog[]>([]);

  // Efecto para detectar si es PWA o si debe mostrar aviso de instalación
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (!isStandalone && isAuthenticated) {
      const timer = setTimeout(() => setShowInstallPrompt(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const addBird = (newBird: BirdType) => setBirds([...birds, newBird]);
  const updateBird = (updatedBird: BirdType) => {
    setBirds(birds.map(b => b.id === updatedBird.id ? updatedBird : b));
  };
  const addPair = (newPair: BreedingPair) => setPairs([...pairs, newPair]);
  
  const handleAddTrainingLog = (log: TrainingLog) => {
    setTrainingLogs([log, ...trainingLogs]);
    if (log.activity === 'Combate (Oficial)' && log.result) {
      const bird = birds.find(b => b.id === log.birdId);
      if (bird) {
        const updatedBird = {
          ...bird,
          wins: log.result === 'Victoria' ? bird.wins + 1 : bird.wins,
          losses: log.result === 'Derrota' ? bird.losses + 1 : bird.losses
        };
        updateBird(updatedBird);
      }
    }
  };

  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderContent = () => {
    return (
      <div className="page-transition h-full">
        {(() => {
          switch (activeTab) {
            case 'dashboard': return <Dashboard birds={birds} pairs={pairs} />;
            case 'birds': return <BirdList birds={birds} onAddBird={addBird} onUpdateBird={updateBird} trainingLogs={trainingLogs} />;
            case 'breeding': return <BreedingCenter birds={birds} pairs={pairs} onAddPair={addPair} />;
            case 'health': return <HealthManager birds={birds} onUpdateBird={updateBird} />;
            case 'training': return <TrainingCenter birds={birds} logs={trainingLogs} onAddLog={handleAddTrainingLog} />;
            case 'ai': return <AIConsultant birds={birds} />;
            default: return <Dashboard birds={birds} pairs={pairs} />;
          }
        })()}
      </div>
    );
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'birds', label: 'Inventario', icon: <Bird size={20} /> },
    { id: 'breeding', label: 'Genética/Cría', icon: <Dna size={20} /> },
    { id: 'health', label: 'Salud', icon: <Stethoscope size={20} /> },
    { id: 'training', label: 'Entrenamiento', icon: <TrendingUp size={20} /> },
    { id: 'ai', label: 'Consultor IA', icon: <MessageSquareQuote size={20} className="text-amber-400" /> },
  ];

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-200 select-none">
      {/* Aviso de Instalación PWA (Móvil) */}
      {showInstallPrompt && (
        <div className="fixed bottom-20 left-4 right-4 z-[100] bg-indigo-600 p-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-10 border border-indigo-400 flex items-center justify-between no-print md:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl"><Smartphone size={20} /></div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider">Instalar GalloMaster</p>
              <p className="text-[10px] text-indigo-100">Añade a tu pantalla para acceso rápido</p>
            </div>
          </div>
          <button onClick={() => setShowInstallPrompt(false)} className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase">Ok</button>
        </div>
      )}

      {/* Sidebar Desktop / Mobile Overlay */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col 
        transition-transform duration-300 ease-in-out no-print
        md:relative md:translate-x-0 md:flex
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800/50">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Swords className="text-slate-950" size={24} />
            </div>
            <div className="flex flex-col">
              <h1 className="font-black text-xl tracking-tight text-white leading-tight">GalloMaster</h1>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-0.5 leading-none">Pro Edition</p>
            </div>
          </div>
          <button onClick={closeMobileMenu} className="md:hidden p-2 text-slate-500 hover:text-white"><X size={24} /></button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <SidebarLink 
              key={item.id}
              icon={item.icon} 
              label={item.label} 
              active={activeTab === item.id} 
              onClick={() => {
                setActiveTab(item.id);
                closeMobileMenu();
              }} 
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="w-full py-3 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 transition-all flex items-center justify-center gap-2"
          >
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 md:px-8 z-30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-sm md:text-lg font-bold capitalize text-white tracking-wide">
              {menuItems.find(i => i.id === activeTab)?.label || activeTab}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-black text-amber-500">JD</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950 no-scrollbar pb-24 md:pb-8">
          {renderContent()}
        </div>

        {/* Tab Bar Móvil (Estilo App Nativa) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 flex items-center justify-around px-2 z-40 pb-safe">
           {menuItems.slice(0, 4).map((item) => (
             <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 p-2 transition-all ${activeTab === item.id ? 'text-amber-500' : 'text-slate-500'}`}
             >
                {item.icon}
                <span className="text-[9px] font-black uppercase tracking-tighter">{item.label.split('/')[0]}</span>
             </button>
           ))}
           <button 
              onClick={() => setActiveTab('ai')}
              className={`flex flex-col items-center gap-1 p-2 transition-all ${activeTab === 'ai' ? 'text-amber-500' : 'text-slate-500'}`}
           >
              <MessageSquareQuote size={20} />
              <span className="text-[9px] font-black uppercase tracking-tighter">IA</span>
           </button>
        </nav>
      </main>
    </div>
  );
};

const SidebarLink: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group ${active ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-lg shadow-amber-500/5' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'}`}>
    <span className={`${active ? 'text-amber-500' : 'text-slate-500 group-hover:text-slate-400'}`}>{icon}</span>
    <span className="font-bold text-sm tracking-tight">{label}</span>
    {active && <ChevronRight size={14} className="ml-auto" />}
  </button>
);

export default App;
