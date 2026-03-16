import React from 'react';
import { BrainCircuit, Users, Sparkles, Timer, Check, Info } from 'lucide-react';

const AssistantHeader = ({ isInvited }) => (
    <div className="bg-[#008964] p-4 pb-0 flex items-center justify-between rounded-t-[32px] relative overflow-visible">
        <div className="flex items-center gap-3 pb-4 pl-4 pr-4">
            <div>
                <h2 className="text-white font-bold text-xl leading-tight uppercase tracking-wide font-sans italic">
                    {isInvited ? 'MISSION ALERT' : 'AI EXAMINER'}
                </h2>
                <div className="flex items-center gap-1">
                    <span className="text-[10px] text-white/80 font-medium tracking-widest">
                        {isInvited ? 'INVITATION TO TEST' : 'PREPARATION PHASE'}
                    </span>
                </div>
            </div>
        </div>
        <img
            src="https://i.ibb.co.com/1YxC8s8z/waiter.png"
            draggable={false}
            alt="Waiter AI"
            className="absolute right-0 bottom-0 w-32 h-32 margin-0 object-contain"
        />
    </div>
);

const AssesmentBriefing = ({ isOpen, onClose, onConfirm, groupTitle, isInvited }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[3000] flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                onClick={onClose}
                className="absolute inset-0 bg-transparent"
            ></div>

            <div className={`relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] flex flex-col shadow-2xl transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                <AssistantHeader isInvited={isInvited} />

                <div className="overflow-y-auto p-10 pt-7 pb-10 bg-slate-50/50 rounded-b-[32px]">
                    <h2 className="text-3xl font-black text-slate-800 leading-[1.1] mb-8 italic text-balance font-display uppercase tracking-tighter">
                        {isInvited ? (
                            <>TEMANMU SUDAH SIAP,<br />BAGAIMANA DENGANMU?</>
                        ) : (
                            <>SIAP UNTUK<br />UJIAN INDIVIDU?</>
                        )}
                    </h2>

                    <div className="space-y-8">
                        {/* Point 1 */}
                        <div className="flex gap-4">
                            <div className="w-12 h-12 shrink-0 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-600">
                                <Users size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-800 text-sm font-sans uppercase tracking-[0.05em]">Synchronized Session</h4>
                                <p className="text-xs text-slate-500 leading-relaxed mt-1 font-medium">
                                    {isInvited ? 'Seluruh anggota grup sedang menunggumu untuk memulai sesi ujian sinkron secara privat.' : 'Kamu dan teman-temanmu akan di-asses pada waktu yang sama secara bersamaan, namun dalam sesi privat masing-masing.'}
                                </p>
                            </div>
                        </div>

                        {/* Point 2: Timer */}
                        <div className="flex gap-4">
                            <div className="w-12 h-12 shrink-0 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-500">
                                <Timer size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-800 text-sm font-sans uppercase tracking-[0.05em]">40 Seconds Only</h4>
                                <p className="text-xs text-slate-500 leading-relaxed mt-1 font-medium">Setiap satu pertanyaan hanya dibatasi waktu <span className="text-blue-600 font-bold">40 detik</span>. AI akan otomatis berpindah jika waktu habis.</p>
                            </div>
                        </div>

                        {/* Point 3: Waiting logic */}
                        <div className="flex gap-4">
                            <div className="w-12 h-12 shrink-0 bg-white rounded-2xl shadow-sm flex items-center justify-center text-amber-500">
                                <Info size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-800 text-sm font-sans uppercase tracking-[0.05em]">Approval Needed</h4>
                                <p className="text-xs text-slate-500 leading-relaxed mt-1 font-medium">Ujian hanya akan dimulai setelah semua temanmu memberikan persetujuan untuk menyelesaikan diskusi ini.</p>
                            </div>
                        </div>

                        {/* Point 4: Teacher Report */}
                        <div className="flex gap-4">
                            <div className="w-12 h-12 shrink-0 bg-white rounded-2xl shadow-sm flex items-center justify-center text-rose-500">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-800 text-sm font-sans uppercase tracking-[0.05em]">Teacher Integration</h4>
                                <p className="text-xs text-slate-500 leading-relaxed mt-1 font-medium">Hasil asesmen AI akan langsung dikirim ke Bapak/Ibu Guru sebagai nilai pemahamanmu terhadap buku ini.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10">
                        <button
                            onClick={onConfirm}
                            className="w-full bg-[#008964] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-green-900/20 active:scale-95 transition-all uppercase tracking-widest font-display text-sm group"
                        >
                            <span>{isInvited ? 'Setujui & Mulai Ujian' : 'Saya Siap Menguji Pemahaman'}</span>
                            <Check size={18} className="group-hover:scale-125 transition-transform" />
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full mt-3 py-2 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-600 transition-colors"
                        >
                            {isInvited ? 'Tunggu Sebentar' : 'Kembali Diskusi'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssesmentBriefing;
