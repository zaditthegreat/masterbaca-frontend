import React, { useState, useEffect } from 'react';
import { chatService } from '../services/chatService';

const Groups = ({ onSelectGroup, groupsData = [] }) => {
    const groups = groupsData;
    const loading = groupsData.length === 0;

    // We don't need local fetch anymore since App polls it globally
    // But we might want a simple loading state if strictly empty on first load

    const getUnreadStatus = (groupId, count) => {
        const lastSeen = JSON.parse(localStorage.getItem('groups_last_seen') || '{}');
        const seenCount = lastSeen[groupId] || 0;
        return count > seenCount;
    };

    if (loading && groups.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (groups.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 font-sans">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                    <span className="material-symbols-outlined !text-5xl">group</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2 font-display">My Reading Groups</h2>
                <p className="text-slate-500 max-w-xs mx-auto">
                    You haven't joined any groups yet. Swipe right on books you love to start matching!
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 p-6 font-sans">
            <h1 className="text-3xl font-black text-slate-900 mb-8 font-display">MY GROUPS</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => {
                    const hasNewMessages = getUnreadStatus(group.id, group.messageCount);
                    return (
                        <div
                            key={group.id}
                            onClick={() => onSelectGroup?.(group.id)}
                            className={`bg-white rounded-[24px] overflow-hidden border ${hasNewMessages ? 'border-primary/30 ring-1 ring-primary/10' : 'border-slate-100'} shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group relative`}
                        >
                            {hasNewMessages && (
                                <div className="absolute top-4 right-4 z-30 bg-rose-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full animate-bounce shadow-lg uppercase tracking-widest">
                                    New
                                </div>
                            )}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={group.cover_url || 'https://via.placeholder.com/400x300?text=No+Cover'}
                                    alt={group.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <h3 className="font-bold text-lg leading-tight line-clamp-1">{group.title}</h3>
                                    <p className="text-white/80 text-xs font-medium uppercase tracking-wide">Reading Group #{group.id}</p>
                                </div>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className={`material-symbols-outlined ${hasNewMessages ? 'text-primary animate-pulse' : 'text-slate-400'} text-xl`}>forum</span>
                                    <span className={`text-xs font-bold ${hasNewMessages ? 'text-primary' : 'text-slate-500'} uppercase tracking-wider`}>
                                        {hasNewMessages ? 'New Messages' : 'Join Discussion'}
                                    </span>
                                </div>
                                <span className={`material-symbols-outlined ${hasNewMessages ? 'text-primary' : 'text-slate-300'} group-hover:text-primary transition-colors`}>arrow_forward</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Groups;
