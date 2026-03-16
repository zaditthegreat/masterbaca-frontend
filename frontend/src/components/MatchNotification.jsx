import React from 'react';
import { Users, Sparkles, ChevronRight, X } from 'lucide-react';

const MatchNotification = ({ isOpen, onClose, onJoinChat, groupTitle }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[3000] flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Modal Container */}
            <div className={`relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] flex flex-col shadow-2xl transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Header Section */}
                <div className="bg-[#008964] p-8 pb-10 rounded-t-[32px] sm:rounded-t-[32px] relative overflow-hidden">
                    {/* Abstract Star Pattern background */}
                    <div className="absolute top-0 right-0 w-48 h-48 opacity-20 transform translate-x-10 -translate-y-10 group">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#FFFFFF" d="M44.7,-76.4C58.2,-69.2,70,-58.4,78.3,-45.3C86.7,-32.1,91.7,-16.1,90.1,-0.9C88.5,14.3,80.4,28.6,70.1,41.2C59.9,53.8,47.5,64.8,33.5,72.2C19.5,79.5,3.9,83.2,-11.2,81.4C-26.2,79.5,-40.7,72.1,-53.1,62.1C-65.5,52.2,-75.8,39.7,-81.8,25.4C-87.7,11.1,-89.2,-5.1,-85.8,-20C-82.5,-34.9,-74.3,-48.5,-62.7,-56.4C-51.1,-64.3,-36.1,-66.4,-22.6,-73.6C-9.2,-80.8,2.7,-93.1,44.7,-76.4Z" transform="translate(100 100)" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-white font-black text-2xl leading-none uppercase tracking-tight italic">MATCH FOUND</h2>
                        <div className="flex items-center gap-1.5 mt-2">
                            <span className="text-[10px] text-white/50 font-bold tracking-[0.1em]">POWERED BY</span>
                            <span className="bg-white/10 text-[10px] text-white font-black px-2 py-0.5 rounded uppercase tracking-widest">MASTERBACA AI</span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 space-y-8 flex-1 overflow-y-auto">
                    <div className="text-center">
                        <h3 className="text-[32px] font-black text-slate-900 leading-[1.1] uppercase italic tracking-tighter">
                            SELAMAT!<br />KAMU PUNYA<br />TEMAN BACA
                        </h3>
                        {groupTitle && (
                            <p className="mt-4 px-4 py-1.5 bg-primary/5 text-primary rounded-full text-sm font-black inline-block uppercase tracking-wider">
                                {groupTitle}
                            </p>
                        )}
                        <p className="text-slate-500 text-sm font-medium mt-6 leading-relaxed">
                            Ambil bukunya di perpustakaan sekolah, baca bersama teman-temanmu, dan diskusikan selama sebulan.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Feature 1 */}
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-center text-primary shrink-0">
                                <Users size={28} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 leading-none">Grup Diskusi Siap</h4>
                                <p className="text-slate-500 text-xs mt-1.5 leading-relaxed font-medium">
                                    Grup chat otomatis dibuat. Kamu bisa langsung ngobrol dan mendiskusikan buku bersama teman baca.
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
                                <Sparkles size={28} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 leading-none">AI Assessment Akhir Bulan</h4>
                                <p className="text-slate-500 text-xs mt-1.5 leading-relaxed font-medium">
                                    Setelah sebulan membaca dan diskusi, AI akan menilai pemahaman dan partisipasimu. Pastikan merangkum dan benar-benar paham!
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => onJoinChat()}
                        className="w-full bg-[#008964] hover:bg-[#007656] text-white py-5 rounded-2xl font-black uppercase tracking-[0.1em] text-sm flex items-center justify-center gap-3 shadow-xl shadow-emerald-900/10 transition-all active:scale-95 group"
                    >
                        <span>MASUK GRUP CHAT</span>
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="pb-4"></div>
                </div>
            </div>
        </div>
    );
};

export default MatchNotification;
