import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, ArrowLeft, Sparkles, Loader2, Info, X, FileImage, Plus, Minus, CheckCircle2, ChevronUp, ChevronDown } from 'lucide-react';
import { bookService } from '../services/bookService';

const UploadBook = ({ onUploadSuccess, onBack }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [queue, setQueue] = useState([]); // [{id, file, preview, qty, status: 'idle'|'uploading'|'success'|'error', errorMsg}]
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const [globalError, setGlobalError] = useState('');

    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const dropZoneRef = useRef(null);

    // Detect Device Width
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                startCamera();
            }
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const startCamera = async () => {
        try {
            setIsCameraActive(true);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setGlobalError("Gagal mengakses kamera. Silakan berikan izin atau gunakan upload file.");
            setIsCameraActive(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            setIsCameraActive(false);
        }
    };

    const addToQueue = (files) => {
        const newItems = Array.from(files).map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: URL.createObjectURL(file),
            qty: 1,
            status: 'idle',
            errorMsg: ''
        }));
        setQueue(prev => [...prev, ...newItems]);
        setShowReview(true);
        if (isMobile) stopCamera();
    };

    const takePhoto = () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0);

        canvas.toBlob((blob) => {
            const file = new File([blob], `capture_${Date.now()}.jpg`, { type: "image/jpeg" });
            addToQueue([file]);
        }, 'image/jpeg');
    };

    const updateItemQty = (id, delta) => {
        setQueue(prev => prev.map(item =>
            item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
        ));
    };

    const removeItem = (id) => {
        const newQueue = queue.filter(item => item.id !== id);
        setQueue(newQueue);
        if (newQueue.length === 0) {
            setShowReview(false);
            if (isMobile) startCamera();
        }
    };

    const processQueue = async () => {
        const pendingItems = queue.filter(item => item.status === 'idle' || item.status === 'error');

        for (const item of pendingItems) {
            setQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'uploading' } : i));

            try {
                await bookService.uploadBook(item.file, item.qty);
                setQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'success' } : i));
            } catch (err) {
                const msg = err.response?.data?.message || 'Gagal upload';
                setQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'error', errorMsg: msg } : i));
            }
        }

        const allSuccess = queue.every(i => i.status === 'success');
        if (allSuccess) {
            setTimeout(() => onUploadSuccess(), 1500);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        if (files.length > 0) addToQueue(files);
    };

    return (
        <div className="flex-1 bg-white min-h-screen flex flex-col font-sans">
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-slate-50 sticky top-0 bg-white/80 backdrop-blur-md z-30">
                <button onClick={onBack} className="p-2 rounded-xl hover:bg-slate-50 text-slate-400">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-lg font-black text-slate-900 font-display uppercase tracking-widest text-center flex-1">AI Assistant</h2>
                <div className="w-10"></div>
            </div>

            <div className="p-8 max-w-4xl mx-auto w-full space-y-10 flex-1">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-slate-900 leading-tight">Book Contribution.</h1>
                    <p className="text-sm text-slate-500 font-medium italic">Scanner AI akan menganalisis detail buku secara otomatis.</p>
                </div>

                {/* Input Area */}
                {!isMobile ? (
                    /* Desktop: Drag & Drop */
                    <div
                        ref={dropZoneRef}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-video w-full rounded-[48px] bg-slate-50 border-4 border-dashed border-slate-200 flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group"
                    >
                        <div className="w-24 h-24 bg-white rounded-[32px] shadow-xl shadow-slate-200/50 flex items-center justify-center text-slate-300 group-hover:text-primary transition-all group-hover:scale-110">
                            <Upload size={48} />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-black text-slate-900 uppercase tracking-widest">Klik atau Drag & Drop</p>
                            <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-tighter">Support multiple files (JPG, PNG)</p>
                        </div>
                    </div>
                ) : (
                    /* Mobile: Instant Camera */
                    <div className="relative aspect-[3/4] w-full rounded-[48px] bg-black border-4 border-white shadow-2xl overflow-hidden">
                        {isCameraActive ? (
                            <>
                                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                <div className="absolute top-6 right-6 z-40">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-4 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/20 active:scale-95 transition-all"
                                    >
                                        <Upload size={24} />
                                    </button>
                                </div>
                                <div className="absolute bottom-10 left-0 right-0 flex justify-center z-40">
                                    <button
                                        onClick={takePhoto}
                                        className="w-24 h-24 rounded-full border-8 border-white/30 bg-white shadow-2xl flex items-center justify-center active:scale-90 transition-all"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-primary border-4 border-white"></div>
                                    </button>
                                </div>
                                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-primary/40 shadow-[0_0_15px_rgba(0,163,122,0.8)] animate-scan-slow pointer-events-none"></div>
                            </>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-slate-500">
                                <Loader2 className="animate-spin" />
                                <span className="text-xs font-black uppercase tracking-widest text-slate-300">Initializing Camera...</span>
                            </div>
                        )}
                    </div>
                )}

                <input type="file" ref={fileInputRef} multiple className="hidden" accept="image/*" onChange={(e) => addToQueue(e.target.files)} />

                {/* Global Error */}
                {globalError && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-[24px] border border-red-100 flex items-center gap-3 text-sm font-bold animate-shake">
                        <Info size={18} />
                        {globalError}
                    </div>
                )}

                {/* Modal / Queue List */}
                {queue.length > 0 && (
                    <div className={`fixed inset-0 z-50 mt-0 flex items-end md:items-center justify-center p-0 md:p-10 pointer-events-none transition-all duration-300 ${showReview ? 'bg-slate-900/60 backdrop-blur-sm pointer-events-auto' : ''}`}>
                        {showReview && <div className="absolute inset-0 pointer-events-auto" onClick={() => { startCamera(); setShowReview(false); }}></div>}

                        <div
                            className={`relative bg-white w-full max-w-2xl h-[85vh] md:h-auto md:max-h-[80vh] rounded-t-[48px] md:rounded-[48px] shadow-2xl flex flex-col overflow-hidden pointer-events-auto transition-transform duration-500 ease-out ${!showReview ? 'translate-y-[calc(100%-100px)]' : 'translate-y-0'}`}
                        >
                            {/* Modal Header */}
                            <div
                                className={`p-8 pb-4 flex items-center justify-between border-b border-slate-50 cursor-pointer transition-colors duration-300 ${!showReview ? 'bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-[48px] border-t-2 border-primary/20' : 'bg-white'}`}
                                onClick={() => !showReview && setShowReview(true)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <h3 className="text-2xl font-black text-slate-900 font-display italic uppercase tracking-tighter">Review Upload</h3>
                                        <div className="absolute -top-1 -right-4 w-5 h-5 bg-primary text-white text-[10px] flex items-center justify-center rounded-full font-black border-2 border-white shadow-sm animate-bounce">
                                            {queue.length}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (showReview) {
                                            startCamera();
                                            setShowReview(false);
                                        } else {
                                            setShowReview(true);
                                        }
                                    }}
                                    className={`p-3 rounded-2xl transition-all ${showReview ? 'bg-slate-100 text-slate-400 hover:text-red-500' : 'bg-primary text-white shadow-lg shadow-green-900/20'}`}
                                >
                                    {showReview ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                                </button>
                            </div>

                            {/* List Area */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
                                {queue.map((item) => (
                                    <div key={item.id} className="group relative flex gap-6 p-4 rounded-[32px] bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all">
                                        {/* Image Preview */}
                                        <div className="w-24 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg shrink-0">
                                            <img src={item.preview} className="w-full h-full object-cover" alt="book cover" />
                                            {item.status === 'uploading' && (
                                                <div className="absolute inset-0 bg-primary/40 flex items-center justify-center backdrop-blur-[2px]">
                                                    <Loader2 className="text-white animate-spin" />
                                                </div>
                                            )}
                                            {item.status === 'success' && (
                                                <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center backdrop-blur-[2px]">
                                                    <CheckCircle2 className="text-white" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Controls */}
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Atur Stok</span>
                                                    {item.status === 'idle' && (
                                                        <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                            <X size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <button
                                                        onClick={() => updateItemQty(item.id, -1)}
                                                        className="w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 active:scale-90 transition-all"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-lg font-black text-slate-900 w-6 text-center">{item.qty}</span>
                                                    <button
                                                        onClick={() => updateItemQty(item.id, 1)}
                                                        className="w-8 h-8 rounded-lg bg-primary text-white shadow-lg shadow-green-900/20 flex items-center justify-center active:scale-90 transition-all"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            {item.status === 'error' && (
                                                <p className="text-[10px] font-bold text-red-500 bg-red-50 p-2 rounded-xl border border-red-100 mt-2">
                                                    {item.errorMsg}
                                                </p>
                                            )}
                                            {item.status === 'success' && (
                                                <p className="text-[10px] font-bold text-green-600 bg-green-50 p-2 rounded-xl border border-green-100 mt-2">
                                                    Berhasil dianalisis AI!
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Add More Button at bottom of list */}
                                <button
                                    onClick={() => {
                                        if (isMobile) {
                                            setShowReview(false);
                                            startCamera();
                                        } else {
                                            fileInputRef.current?.click();
                                        }
                                    }}
                                    className="w-full py-8 rounded-[32px] border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-primary/40 hover:text-primary transition-all active:scale-[0.98]"
                                >
                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                                        <Plus size={20} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{isMobile ? 'Foto Buku Lain' : 'Tambah File Lain'}</span>
                                </button>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 pt-4 bg-white border-t border-slate-50">
                                <button
                                    onClick={processQueue}
                                    disabled={queue.every(i => i.status === 'uploading' || i.status === 'success')}
                                    className="w-full bg-[#008964] text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 shadow-2xl shadow-green-900/20 active:scale-[0.98] transition-all font-display uppercase tracking-widest disabled:opacity-50"
                                >
                                    <Sparkles size={20} />
                                    <span>Proses {queue.filter(i => i.status !== 'success').length} Buku</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes scan-slow {
            0% { top: 10%; }
            100% { top: 90%; }
        }
        .animate-scan-slow {
            animation: scan-slow 3s ease-in-out infinite alternate;
        }
        .animate-shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        .animate-slide-up {
            animation: slide-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes slide-up {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #e2e8f0;
            border-radius: 10px;
        }
      `}</style>
        </div>
    );
};

export default UploadBook;
