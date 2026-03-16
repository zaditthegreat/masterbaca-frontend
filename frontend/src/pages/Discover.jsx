import React, { useEffect, useState } from 'react';
import PickCard from '../components/pick-card/PickCard';
import { studentService } from '../services/studentService';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';

const Discover = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                const data = await studentService.getTimeline();
                // If API returns an array, use it. If it returns a nested structure, adjust.
                // Assuming it returns an array of books based on common patterns.
                setBooks(Array.isArray(data) ? data : (data.books || []));
            } catch (err) {
                console.error("Failed to fetch timeline:", err);
                setError("Gagal memuat rekomendasi buku.");
            } finally {
                setLoading(false);
            }
        };
        fetchTimeline();
    }, []);

    const handleEvaluate = async (card, status) => {
        const direction = status === 'good' ? 'right' : 'left';
        try {
            await studentService.swipeBook(card.id, direction);
            console.log(`Evaluated ${card.title || card.name} as ${status}`);
        } catch (err) {
            console.error("Swipe failed:", err);
            // Optional: Show toast or revert UI state
        }
    };

    if (loading) return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <Sparkles size={24} className="absolute inset-0 m-auto text-primary animate-pulse" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Curating for you...</p>
        </div>
    );

    if (error || books.length === 0) return (
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center gap-6">
            <div className="w-20 h-20 bg-slate-100 rounded-[32px] flex items-center justify-center text-slate-300">
                <AlertCircle size={40} />
            </div>
            <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 italic uppercase font-display">No Recommendations.</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    {error || "Lakukan asisten profil terlebih dahulu atau cek kembali nanti untuk buku baru."}
                </p>
            </div>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col items-center justify-center -mt-4 font-sans">
            <div className="w-full max-w-sm h-[75vh] flex items-center justify-center">
                <PickCard
                    cardList={books}
                    onEvaluate={handleEvaluate}
                />
            </div>
        </div>
    );
};

export default Discover;
