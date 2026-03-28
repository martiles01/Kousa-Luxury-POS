import React from 'react';
import LogoKousa from '../components/common/Logo';

const Login = ({
    authView,
    setAuthView,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    authError,
    setAuthError,
    successMessage,
    setSuccessMessage,
    handleLogin,
    handleResetPassword,
    handleUpdatePassword,
    loading
}) => {
    return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center font-montserrat relative overflow-hidden p-4">
            <div className="absolute top-[-15%] left-[-15%] w-[50%] h-[50%] bg-blue-900/15 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] bg-red-900/10 rounded-full blur-[140px] pointer-events-none"></div>

            <div className="bg-white rounded-[3rem] sm:rounded-[4rem] p-10 sm:p-14 w-full max-w-[460px] shadow-[0_30px_70px_rgba(0,0,0,0.5)] border border-white/5 animate-in fade-in zoom-in duration-1000 relative z-10 mx-auto text-center">
                <div className="mb-10">
                    <div className="mb-6 inline-flex p-5 rounded-[2rem] bg-slate-50 shadow-inner mx-auto">
                        <LogoKousa className="!text-slate-900" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                        Control <span className="text-luxury-red">Total</span>
                    </h1>
                    <div className="flex justify-center mt-4">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] px-3 py-1 bg-slate-50 rounded-full">Kousa Luxury Admin</p>
                    </div>
                </div>

                {authView === 'login' && (
                    <form onSubmit={handleLogin} className="space-y-6 text-left">
                        <div>
                            <label htmlFor="email" className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Correo Electrónico</label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="username"
                                required
                                className="w-full mt-2 p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-red outline-none transition-all font-bold text-slate-800"
                                placeholder="usuario@kousa.com"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Contraseña</label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="w-full mt-2 p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-red outline-none transition-all font-bold text-slate-800"
                                placeholder="••••••••"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                            />
                        </div>

                        {authError && (
                            <p className="text-center text-luxury-red text-[10px] font-black uppercase tracking-tight bg-red-50 p-3 rounded-xl animate-bounce">
                                {authError}
                            </p>
                        )}

                        {successMessage && (
                            <p className="text-center text-emerald-600 text-[10px] font-black uppercase tracking-tight bg-emerald-50 p-3 rounded-xl">
                                {successMessage}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-6 bg-luxury-blue text-white rounded-2xl font-black hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20 uppercase text-xs tracking-[0.3em] active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'VERIFICANDO...' : 'INICIAR SESIÓN'}
                        </button>

                        <button
                            type="button"
                            onClick={() => { setAuthView('forgot'); setAuthError(''); setSuccessMessage(''); }}
                            className="w-full text-[10px] font-black text-slate-400 hover:text-luxury-red transition-colors uppercase tracking-[0.2em]"
                        >
                            ¿Olvidaste tu contraseña?
                        </button>
                    </form>
                )}

                {authView === 'forgot' && (
                    <form onSubmit={handleResetPassword} className="space-y-6 text-left">
                        <div className="text-center mb-6">
                            <p className="text-xs font-bold text-slate-500">Ingresa tu correo para recibir un enlace de recuperación.</p>
                        </div>
                        <div>
                            <label htmlFor="reset-email" className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Correo Electrónico</label>
                            <input
                                id="reset-email"
                                type="email"
                                autoComplete="email"
                                required
                                className="w-full mt-2 p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-red outline-none transition-all font-bold text-slate-800"
                                placeholder="usuario@kousa.com"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                            />
                        </div>

                        {authError && (
                            <p className="text-center text-luxury-red text-[10px] font-black uppercase tracking-tight bg-red-50 p-3 rounded-xl">
                                {authError}
                            </p>
                        )}

                        {successMessage && (
                            <p className="text-center text-emerald-600 text-[10px] font-black uppercase tracking-tight bg-emerald-50 p-3 rounded-xl">
                                {successMessage}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-6 bg-luxury-red text-white rounded-2xl font-black hover:bg-red-800 transition-all shadow-xl shadow-red-900/20 uppercase text-xs tracking-[0.3em] active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'ENVIANDO...' : 'ENVIAR ENLACE'}
                        </button>

                        <button
                            type="button"
                            onClick={() => { setAuthView('login'); setAuthError(''); setSuccessMessage(''); }}
                            className="w-full text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.2em]"
                        >
                            Volver al inicio
                        </button>
                    </form>
                )}

                {authView === 'update' && (
                    <form onSubmit={handleUpdatePassword} className="space-y-6 text-left">
                        <div className="text-center mb-6">
                            <p className="text-xs font-bold text-slate-500">Establece tu nueva contraseña de acceso.</p>
                        </div>
                        <div>
                            <label htmlFor="new-password" className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Nueva Contraseña</label>
                            <input
                                id="new-password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="w-full mt-2 p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none transition-all font-bold text-slate-800"
                                placeholder="••••••••"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                            />
                        </div>

                        {authError && (
                            <p className="text-center text-luxury-red text-[10px] font-black uppercase tracking-tight bg-red-50 p-3 rounded-xl">
                                {authError}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-6 bg-luxury-blue text-white rounded-2xl font-black hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20 uppercase text-xs tracking-[0.3em] active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'ACTUALIZANDO...' : 'ACTUALIZAR CONTRASEÑA'}
                        </button>
                    </form>
                )}

                <p className="mt-8 text-center text-[9px] font-black text-slate-300 uppercase tracking-widest">
                    Kousa Auto Import & Care — v1.0.3
                </p>
            </div>
        </div>
    );
};

export default Login;
