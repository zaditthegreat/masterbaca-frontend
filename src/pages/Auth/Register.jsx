import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck, Mail, Loader2, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';

const Register = ({ onNavigate }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password) {
            setError('Harap isi semua bidang.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await authService.register(formData);
            // Registration successful, navigate to login
            onNavigate('login');
            alert('Registrasi berhasil! Silakan login.');
        } catch (err) {
            console.error("Register error:", err);
            setError(err.response?.data?.message || 'Registrasi gagal. Coba lagi nanti.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center p-6 font-sans">
            <div className="max-w-md w-full mx-auto space-y-10">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-3xl text-blue-500 mb-4 transform -rotate-3">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight font-display italic uppercase">NEW MEMBER.</h1>
                    <p className="text-slate-500 font-medium font-sans text-sm">Buat akun untuk mulai membaca secara cerdas.</p>
                </div>

                <form onSubmit={handleRegister} className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                            <div className="relative group">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="email"
                                    autoComplete="email"
                                    placeholder="name@email.com"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700"
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="Minimal 8 karakter"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700"
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-[11px] font-bold text-blue-600 uppercase tracking-wider text-center">
                        Terdaftar Sebagai Akun Siswa
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100">
                            <AlertCircle size={14} />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all font-display uppercase tracking-widest ${loading ? 'opacity-70' : ''}`}
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : (
                            <>
                                <span>Daftar Sekarang</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-sm font-medium text-slate-500 font-sans">
                    Sudah punya akun? {' '}
                    <button
                        type="button"
                        onClick={() => onNavigate('login')}
                        className="text-blue-600 font-black hover:underline uppercase text-xs tracking-wider"
                    >
                        Login Disini
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Register;
