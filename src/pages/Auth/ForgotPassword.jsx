import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, Key } from 'lucide-react';

const ForgotPassword = ({ onReset, onNavigate }) => {
    const [email, setEmail] = useState('');

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center p-6 font-sans">
            <div className="max-w-md w-full mx-auto space-y-10">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/10 rounded-3xl text-amber-500 mb-4 transform rotate-12">
                        <Key size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight font-display italic uppercase">RESET KEY.</h1>
                    <p className="text-slate-500 font-medium">Masukkan email Anda untuk memulihkan akses.</p>
                </div>

                <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Terdaftar</label>
                            <div className="relative group">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                                <input
                                    type="email"
                                    placeholder="anda@email.com"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => onReset(email)}
                        className="w-full bg-amber-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20 active:scale-[0.98] transition-all font-display uppercase tracking-wider"
                    >
                        <span>Kirim Instruksi</span>
                        <Send size={18} />
                    </button>
                </div>

                <button
                    onClick={() => onNavigate('login')}
                    className="w-full flex items-center justify-center gap-2 text-sm font-black text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Kembali ke Login
                </button>
            </div>
        </div>
    );
};

export default ForgotPassword;
