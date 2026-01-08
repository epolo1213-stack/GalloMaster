
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Github, Chrome, Swords } from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulación de carga para efecto visual profesional
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-950">
      {/* Elementos Decorativos de Fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
      
      {/* Imagen de Fondo: Gallo Navajero Peruano (Estética Elite) */}
      <div 
        className="absolute inset-0 opacity-[0.15] grayscale pointer-events-none transition-all duration-1000"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1621644342337-377319985226?auto=format&fit=crop&q=80&w=1600")',
          backgroundSize: 'cover',
          backgroundPosition: 'right 20% center',
          filter: 'contrast(1.2) brightness(0.8)'
        }}
      />
      
      {/* Overlay de gradiente para mejorar legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/80 to-transparent" />

      <div className="w-full max-w-md p-4 z-10 animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500 rounded-3xl shadow-2xl shadow-amber-500/30 mb-6 border border-amber-400/20">
            <Swords className="text-slate-950" size={44} />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-5xl font-black text-white tracking-tighter leading-none">
              GALLO<span className="text-amber-500">MASTER</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-1.5">Elite Edition</p>
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div className="flex bg-slate-950/50 p-1.5 rounded-2xl mb-8 border border-slate-800">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all duration-300 ${isLogin ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/10' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Ingresar
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all duration-300 ${!isLogin ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/10' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2 animate-in slide-in-from-left-4 duration-300">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-1.5 tracking-wider">Nombre de la Granja</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text" 
                    required
                    placeholder="Eje: El Centenario"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all placeholder:text-slate-700"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-1.5 tracking-wider">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="admin@tu-granja.com"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Contraseña</label>
                {isLogin && (
                  <button type="button" className="text-[10px] font-bold text-amber-500 hover:text-amber-400 transition-colors">¿Olvidaste?</button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-800 text-slate-950 font-black py-4.5 rounded-2xl transition-all shadow-xl shadow-amber-500/20 uppercase tracking-widest text-xs flex items-center justify-center gap-2 group mt-4 h-[58px]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Entrar al Sistema' : 'Crear mi Cuenta'}
                  <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="w-full border-t border-slate-800"></div>
              <span className="absolute bg-[#141d2e] px-3 text-[10px] text-slate-600 font-black uppercase tracking-widest">O continúa con</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2.5 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
                <Chrome size={16} /> Google
              </button>
              <button className="flex items-center justify-center gap-2.5 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
                <Github size={16} /> Github
              </button>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2.5">
          <ShieldCheck size={14} className="text-amber-500/40" /> 
          Seguridad Cifrada GalloMaster Pro
        </p>
      </div>
    </div>
  );
};

export default Auth;
