import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Trash2, Loader2, Sparkles, Book as BookIcon } from 'lucide-react';
import { bookService } from '../services/bookService';
import { API_BASE_URL } from '../services/apiClient';

const EditBook = ({ bookData, onSaveSuccess, onBack }) => {
    const [formData, setFormData] = useState({
        title: bookData?.title || '',
        author: bookData?.author || '',
        genre: bookData?.genre || '',
        summary: bookData?.summary || '',
        difficulty_level: bookData?.difficulty_level || 'beginner'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await bookService.updateBook(bookData.id, formData);
            onSaveSuccess();
        } catch (err) {
            console.error("Failed to update book:", err);
            setError(err.response?.data?.message || "Gagal memperbarui data buku.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 bg-white min-h-screen font-sans flex flex-col">
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-slate-50 sticky top-0 bg-white/80 backdrop-blur-md z-30">
                <button onClick={onBack} className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-lg font-black text-slate-900 font-display uppercase tracking-widest text-center flex-1">Metadata Editor</h2>
                <div className="w-10"></div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 max-w-2xl mx-auto w-full space-y-10 flex-1">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-slate-900 leading-tight italic font-display">Refine Details.</h1>
                    <p className="text-sm text-slate-500 font-medium italic">Perbarui informasi buku untuk akurasi rekomendasi AI.</p>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-xs font-bold animate-shake">
                        {error}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-10">
                    {/* Visual Preview */}
                    <div className="w-full md:w-56 space-y-4 shrink-0">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Original Cover</label>
                        <div className="aspect-[3/4] rounded-[32px] bg-slate-50 border-2 border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden relative">
                            <img
                                src={`${API_BASE_URL}${bookData.cover_url}`}
                                alt="Cover"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                                <p className="text-[8px] font-bold text-white/80 uppercase tracking-widest">Read Only Reference</p>
                            </div>
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Juduk Buku</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-900 placeholder:text-slate-300 transition-all font-display"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Penulis / Author</label>
                            <input
                                type="text"
                                required
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-900 placeholder:text-slate-300 transition-all font-display"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Genre (Pisahkan koma)</label>
                            <input
                                type="text"
                                value={formData.genre}
                                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                                placeholder="Mystery, Sci-Fi..."
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-900 placeholder:text-slate-300 transition-all font-display"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Difficulty Level</label>
                            <div className="flex gap-2">
                                {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                                    <button
                                        key={lvl}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, difficulty_level: lvl })}
                                        className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.difficulty_level === lvl
                                                ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                                                : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                                            }`}
                                    >
                                        {lvl}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Summary</label>
                            <textarea
                                rows={4}
                                value={formData.summary}
                                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium text-slate-600 placeholder:text-slate-300 transition-all text-sm leading-relaxed"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-10">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/10 active:scale-[0.98] transition-all font-display uppercase tracking-widest disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        <span>{loading ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditBook;
