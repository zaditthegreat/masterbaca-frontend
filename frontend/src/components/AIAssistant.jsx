import React, { useState, useEffect } from 'react';
import { ArrowLeft, BrainCircuit, Users, Coffee, Sparkles, Check } from 'lucide-react';
import { studentService } from '../services/studentService';

const AssistantHeader = ({ onBack, currentPage, showIntro }) => (
    <div className="bg-[#008964] p-4 pb-0 flex items-center justify-between rounded-t-[32px] relative overflow-visible">
        <div className="flex items-center gap-3 pb-4 pl-4 pr-4">
            <div>
                <h2 className="text-white font-bold text-lg leading-tight uppercase tracking-wide font-sans">
                    {showIntro ? 'Quick Assessment' : 'AI Profiler'}
                </h2>
                <div className="flex items-center gap-1">
                    <span className="text-[10px] text-white/80 font-medium">POWERED BY</span>
                    <span className="bg-white/20 text-[10px] text-white font-bold px-1.5 py-0.5 rounded">MASTERBACA AI</span>
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

const AIAssistant = ({ isOpen, onClose }) => {
    const [showIntro, setShowIntro] = useState(true);
    const [selectedValue, setSelectedValue] = useState([]);

    const [messages, setMessages] = useState([]);

    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);

    // Dynamic Input States
    const [answerType, setAnswerType] = useState('text'); // text, multiple_choice, scale_7, likert_scale
    const [options, setOptions] = useState([]);
    const [isComplete, setIsComplete] = useState(false);

    // Initial load for first question
    useEffect(() => {
        if (!showIntro && messages.length === 0 && isOpen && !isComplete) {
            startProfiling();
        }
    }, [showIntro, isOpen]);

    const startProfiling = async () => {
        setLoading(true);
        try {
            const response = await studentService.interactProfile([]);
            const question = response.question || response;

            setAnswerType(question.answer_type || 'text');
            setOptions(question.options || []);
            setMessages([{ role: 'assistant', content: question.text }]);
        } catch (error) {
            console.error('Failed to start profiling:', error);
            setMessages([{ role: 'assistant', content: 'Maaf, gagal memuat pertanyaan pertama. Hubungi admin.' }]);
        } finally {
            setLoading(false);
        }
    };

    const formatConversation = (history) => {
        const formatted = [];
        for (let i = 0; i < history.length; i += 2) {
            if (history[i] && history[i + 1]) {
                formatted.push({
                    question: history[i].content,
                    answer: history[i + 1].content
                });
            }
        }
        return formatted;
    };

    const toggleValue = (value) => {
        setSelectedValue((prev) => {
            if (prev.includes(value)) {
                return prev.filter(v => v !== value);
            }
            return [...prev, value];
        });
    };

    const handleSendMessage = async (overrideContent) => {
        const content = overrideContent || inputText;
        if ((!content && selectedValue.length === 0) || loading) return;

        const newUserMessage = { role: 'user', content: Array.isArray(content) ? content.join(', ') : content };
        const updatedHistory = [...messages, newUserMessage];

        setMessages(updatedHistory);
        setInputText('');
        setSelectedValue([]);
        setLoading(true);

        try {
            const conversationPayload = formatConversation(updatedHistory);
            const response = await studentService.interactProfile(conversationPayload);
            const question = response.question || response;

            if (!question.answer_type) {
                setIsComplete(true);
                return;
            }

            // Update metadata for next question
            setAnswerType(question.answer_type || 'text');
            setOptions(question.options || []);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: question.text
            }]);
        } catch (error) {
            console.error('AI Profile interaction failed:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Maaf, sepertinya sedang ada gangguan koneksi.' }]);
        } finally {
            setLoading(false);
        }
    };

    const getCircleSize = (num) => {
        const distance = Math.abs(num - 4);
        if (distance === 0) return 'w-8 h-8';
        if (distance === 1) return 'w-9 h-9';
        if (distance === 2) return 'w-10 h-10';
        return 'w-11 h-11';
    };

    const getCircleBorder = (num) => {
        const distance = num - 4;
        if (distance < 0) return 'border-indigo-600';
        if (distance > 0) return 'border-emerald-600';
        return 'border-gray-600';
    };

    return (
        <div className={`fixed inset-0 z-[100] transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
            <div
                onClick={onClose}
                className={`absolute inset-0 bg-black/40 backdrop-blur-[4px] transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            ></div>

            {/* Adjusted: Dynamic height using h-auto and max-h */}
            <div className={`absolute inset-x-0 bottom-0 bg-white rounded-t-[32px] flex flex-col shadow-2xl transition-transform duration-500 ease-in-out ${isOpen ? 'translate-y-0 max-h-[90%] h-auto' : 'translate-y-[120%] h-auto'}`}>
                <AssistantHeader onBack={showIntro ? onClose : () => setShowIntro(true)} showIntro={showIntro} />

                {showIntro ? (
                    /* Opening Page Area */
                    <div className="overflow-y-auto p-10 pt-7 pb-10 bg-slate-50/50">
                        <h2 className="text-4xl font-black text-slate-800 leading-[1.1] mb-8 italic text-balance font-display">CARI BUKU GAK BOLEH ASAL.</h2>

                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 shrink-0 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-600">
                                    <BrainCircuit size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm font-sans">Mapping Brain Vector</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed mt-1">Kami menganalisis cara berpikirmu agar buku yang didapat bukan cuma pajangan, tapi benar-benar 'klik'.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 shrink-0 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-500">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm font-sans">The Right Circle</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed mt-1">Karena stok terbatas, kami ingin kamu dipasangkan dengan teman yang punya frekuensi diskusi yang sama.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 shrink-0 bg-white rounded-2xl shadow-sm flex items-center justify-center text-amber-500">
                                    <Coffee size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm font-sans">Deep Conversation</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed mt-1">Hanya 5 menit asesmen untuk kenyamanan diskusi selama 1 bulan penuh.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button
                                onClick={() => setShowIntro(false)}
                                className="w-full bg-[#008964] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-900/10 active:scale-95 transition-all"
                            >
                                <span>Mulai Sekarang</span>
                                <Sparkles size={18} />
                            </button>
                        </div>
                    </div>
                ) : isComplete ? (
                    /* Completion Page Area */
                    <div className="overflow-y-auto p-10 pt-7 pb-10 bg-slate-50/50">
                        <h2 className="text-4xl font-black text-slate-800 leading-[1.1] mb-8 italic text-balance uppercase text-[#008964] font-display">PROFILING SELESAI. KAMU SIAP.</h2>

                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 shrink-0 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-600">
                                    <Check size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm font-sans">Brain Vector Locked</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed mt-1">Sistem sudah mengunci frekuensi minatmu. Rekomendasi buku akan sangat akurat sekarang.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 shrink-0 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-500">
                                    <Sparkles size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm font-sans">Personalized Timeline</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed mt-1">Buku-buku di dashboardmu sekarang adalah hasil kurasi AI berdasarkan jawabanmu barusan.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 shrink-0 bg-white rounded-2xl shadow-sm flex items-center justify-center text-amber-500">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm font-sans">Community Frequency</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed mt-1">Kamu akan diprioritaskan untuk masuk ke grup baca dengan frekuensi diskusi yang klik.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button
                                onClick={() => {
                                    onClose();
                                    window.location.reload(); // Refresh to update timeline
                                }}
                                className="w-full bg-[#008964] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-900/10 active:scale-95 transition-all uppercase tracking-wider font-display"
                            >
                                <span>Lihat Rekomendasi</span>
                                <ArrowLeft className="rotate-180" size={18} />
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Chat History Area */
                    <>
                        {/* Adjusting Chat Area to h-[60vh] to keep it dynamic but limited */}
                        <div className="h-[50vh] overflow-y-auto p-6 space-y-4 bg-white">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-[#008964] text-white rounded-tr-none shadow-md'
                                        : 'bg-slate-100 text-slate-700 rounded-tl-none border border-slate-200/50 shadow-sm'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex space-x-1 border border-slate-200/50">
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Area Input Dinamis */}
                        <div className="p-4 bg-white border-t border-slate-100 space-y-4 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.03)] pb-10">

                            {/* Render Input Based on Answer Type */}
                            <div className="w-full">
                                {answerType === 'multiple_choice' && (
                                    <div className="flex flex-wrap gap-2 mb-4 font-sans">
                                        {options.map((choice) => (
                                            <button
                                                key={choice}
                                                onClick={() => toggleValue(choice)}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${selectedValue.includes(choice)
                                                    ? 'border-[#008964] bg-[#008964]/5 text-[#008964] shadow-sm'
                                                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                                    }`}
                                            >
                                                <span className="truncate">{choice}</span>
                                                {selectedValue.includes(choice) && <Check size={14} />}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {answerType === 'scale_7' && (
                                    <div className="flex flex-col gap-3 mb-4 font-sans">
                                        <div className="flex justify-between w-full text-[10px] font-bold text-slate-400 px-1 uppercase tracking-wider">
                                            <span>Buruk</span>
                                            <span>Sangat Baik</span>
                                        </div>
                                        <div className="flex justify-between w-full gap-1 items-center">
                                            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                                                <button
                                                    key={num}
                                                    onClick={() => setSelectedValue([num.toString()])}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all border ${selectedValue.includes(num.toString())
                                                        ? 'bg-[#008964] text-white border-[#008964] shadow-md shadow-green-900/20'
                                                        : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                                                        }`}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {answerType === 'likert_scale' && (
                                    <div className="flex flex-col gap-4 mb-4 font-sans">
                                        <div className="flex justify-between w-full text-[10px] font-bold text-slate-400 px-1 uppercase tracking-wider">
                                            <span>Tidak Setuju</span>
                                            <span>Setuju</span>
                                        </div>
                                        <div className="flex justify-between w-full items-center gap-1 px-1">
                                            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                                                <button
                                                    key={num}
                                                    onClick={() => setSelectedValue([num.toString()])}
                                                    className={`rounded-full flex items-center justify-center transition-all border shadow-sm ${getCircleBorder(num)} ${getCircleSize(num)} ${selectedValue.includes(num.toString())
                                                        ? 'bg-gradient-to-br from-slate-700 to-black text-white border-transparent scale-110 shadow-lg'
                                                        : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                                                        }`}
                                                >
                                                    {selectedValue.includes(num.toString()) && <Check size={14} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {answerType === 'text' && (
                                    <div className="flex gap-2 font-sans">
                                        <input
                                            type="text"
                                            placeholder="Tulis jawabanmu..."
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#008964]/10 transition-all font-medium"
                                        />
                                        <button
                                            onClick={() => handleSendMessage()}
                                            disabled={loading || !inputText.trim()}
                                            className={`px-6 bg-[#008964] text-white rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-green-900/20 ${loading || !inputText.trim() ? 'opacity-50 grayscale' : ''}`}
                                        >
                                            Kirim
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Show Send Button for non-text types if value is selected */}
                            {answerType !== 'text' && (
                                <button
                                    onClick={() => handleSendMessage(selectedValue)}
                                    disabled={loading || selectedValue.length === 0}
                                    className={`w-full bg-[#008964] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-green-900/20 active:scale-[0.98] transition-all font-display ${loading || selectedValue.length === 0 ? 'opacity-50 grayscale' : ''
                                        }`}
                                >
                                    <span>Konfirmasi Jawaban</span>
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AIAssistant;
