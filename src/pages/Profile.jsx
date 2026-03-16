import React, { useState, useEffect } from 'react';
import { Settings, Edit3, LogOut, ChevronRight, Book, Users, Star } from 'lucide-react';
import { studentService } from '../services/studentService';

const Profile = ({ onEditProfile, onLogout }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await studentService.getMyProfile();
                setProfile(data);
            } catch (error) {
                console.error('Failed to fetch profile', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return (
        <div className="flex-1 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="flex-1 bg-slate-50 font-sans overflow-y-auto pb-24">
            {/* Header / Cover */}
            <div className="h-48 bg-gradient-to-br from-primary to-emerald-800 relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            </div>

            <div className="px-6 -mt-16 relative z-10">
                {/* Profile Card */}
                <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-slate-200/60 border border-slate-100 mb-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-[32px] border-4 border-white shadow-lg overflow-hidden bg-slate-100 -mt-16 mb-4">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">
                                    <Users size={40} />
                                </div>
                            )}
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 font-display italic uppercase tracking-tight">
                            {profile?.name || 'Anonymous Reader'}
                        </h2>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1 mb-6">
                            @{profile?.username || 'member'} • Student
                        </p>

                        <button
                            onClick={() => onEditProfile(profile)}
                            className="w-full py-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-center gap-2 text-slate-600 font-black text-sm transition-all border border-slate-100 uppercase tracking-widest"
                        >
                            <Edit3 size={16} />
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center shadow-sm">
                        <Book className="w-5 h-5 text-primary mx-auto mb-2" />
                        <p className="text-lg font-black text-slate-900 leading-none">12</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">Buku</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center shadow-sm">
                        <Star className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                        <p className="text-lg font-black text-slate-900 leading-none">4.8</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">Level</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center shadow-sm">
                        <Users className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                        <p className="text-lg font-black text-slate-900 leading-none">3</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">Grup</p>
                    </div>
                </div>

                {/* Menu List */}
                <div className="space-y-3">
                    <button className="w-full bg-white p-5 rounded-2xl flex items-center justify-between border border-slate-100 shadow-sm group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                <Settings size={20} />
                            </div>
                            <span className="font-bold text-slate-700 text-sm">Pengaturan Akun</span>
                        </div>
                        <ChevronRight size={18} className="text-slate-300" />
                    </button>

                    <button
                        onClick={onLogout}
                        className="w-full bg-red-50 p-5 rounded-2xl flex items-center justify-between border border-red-100 group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-red-400">
                                <LogOut size={20} />
                            </div>
                            <span className="font-bold text-red-600 text-sm">Keluar Aplikasi</span>
                        </div>
                        <ChevronRight size={18} className="text-red-200" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
