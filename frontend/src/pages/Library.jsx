import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Search, Filter, Loader2, MoreVertical, Edit2, Trash2, ArrowRight, Book as BookIcon, ExternalLink } from 'lucide-react';
import { bookService } from '../services/bookService';
import { API_BASE_URL } from '../services/apiClient';

const Library = ({ onUploadClick, onEditClick }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const data = await bookService.getBooks();
            setBooks(data);
        } catch (err) {
            console.error("Failed to fetch books:", err);
            setError("Gagal memuat daftar buku.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Apakah kamu yakin ingin menghapus buku ini?")) return;
        try {
            await bookService.deleteBook(id);
            setBooks(books.filter(b => b.id !== id));
        } catch (err) {
            alert("Gagal menghapus buku.");
        }
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex-1 flex flex-col items-center justify-center p-10">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Memuat Koleksi...</p>
        </div>
    );

    return (
        <div className="flex-1 bg-slate-50 font-sans overflow-y-auto pb-24 h-full">
            {/* Header Section */}
            <div className="p-8 pb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 font-display italic tracking-tight uppercase">Koleksi.</h1>
                    <p className="text-slate-500 font-medium text-sm">Total {books.length} buku dalam repositori.</p>
                </div>
                <button
                    onClick={onUploadClick}
                    className="p-4 bg-primary text-white rounded-[24px] shadow-lg shadow-green-900/20 active:scale-95 transition-all"
                >
                    <Plus size={24} />
                </button>
            </div>

            {/* Action Bar */}
            <div className="px-8 flex gap-3 mb-8 sticky top-0 bg-slate-50/80 backdrop-blur-md py-4 z-20">
                <div className="flex-1 relative group">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari judul atau penulis..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/10 shadow-sm font-medium text-sm"
                    />
                </div>
                <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-primary transition-colors shadow-sm">
                    <Filter size={20} />
                </button>
            </div>

            {/* Books Grid */}
            <div className="px-8 grid grid-cols-1 gap-6 pb-10">
                {filteredBooks.length > 0 ? (
                    filteredBooks.map((book) => (
                        <div key={book.id} className="group relative bg-white rounded-[32px] p-4 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all flex gap-5">
                            {/* Cover Wrap */}
                            <div className="w-24 aspect-[3/4] rounded-2xl overflow-hidden shadow-md shrink-0 bg-slate-100">
                                <img
                                    src={`${API_BASE_URL}${book.cover_url}`}
                                    alt={book.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>

                            {/* Info Wrap */}
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-black text-slate-900 leading-tight line-clamp-2 pr-6">{book.title}</h3>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => onEditClick(book)}
                                                className="p-2 text-slate-300 hover:text-primary transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(book.id)}
                                                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-slate-400 mt-1">{book.author}</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-500 rounded-full uppercase tracking-tighter">
                                            {book.genre || 'General'}
                                        </span>
                                        <span className={`px-3 py-1 border text-[10px] font-black rounded-full uppercase tracking-tighter ${book.difficulty_level === 'beginner' ? 'bg-green-50 text-green-600 border-green-100' :
                                                book.difficulty_level === 'intermediate' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                    'bg-red-50 text-red-600 border-red-100'
                                            }`}>
                                            {book.difficulty_level}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"></div>
                                        ))}
                                        <div className="px-2 text-[10px] font-black text-slate-400 flex items-center">Reader</div>
                                    </div>
                                    <button className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        Detail <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                            <BookIcon size={40} />
                        </div>
                        <p className="text-sm font-bold text-slate-400">Tidak ada buku ditemukan.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Library;
