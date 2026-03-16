import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, User, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';

const Login = ({ onNavigate }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setError('Email dan password wajib diisi.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await authService.login(formData);
            window.location.reload(); // Refresh to trigger dashboard redirect in App.jsx
        } catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.message || 'Login gagal. Cek email & password Anda.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center p-6 font-sans">
            <div className="max-w-md w-full mx-auto space-y-10">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-3xl text-primary mb-4 transform rotate-3">
                        <Sparkles size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight font-display">MASTERBACA.</h1>
                    <p className="text-slate-500 font-medium font-sans">Lanjutkan perjalanan literasimu.</p>
                </div>

                <form onSubmit={handleLogin} className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    autoComplete="email"
                                    placeholder="name@email.com"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-700"
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-700"
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 animate-shake">
                            <AlertCircle size={14} />
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => onNavigate('forgot-password')}
                            className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-wider transition-colors"
                        >
                            Lupa Password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-primary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 active:scale-[0.98] transition-all font-display uppercase tracking-widest ${loading ? 'opacity-70' : ''}`}
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : (
                            <>
                                <span>Masuk Sekarang</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-sm font-medium text-slate-500 font-sans">
                    Belum punya akun? {' '}
                    <button
                        type="button"
                        onClick={() => onNavigate('register')}
                        className="text-primary font-black hover:underline uppercase text-xs tracking-wider"
                    >
                        Daftar Gratis
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
