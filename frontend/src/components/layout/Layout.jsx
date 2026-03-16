import React from 'react';
import { BookOpen, Bell, Compass, Users, Library, User, Settings } from 'lucide-react';

const Layout = ({ children, activeTab, setActiveTab, onOpenAssistant, user, isChatOpen, unreadGroups }) => {
    const role = user?.role || 'student';

    const getNavItems = () => {
        const items = [];

        // Discover (explore) for Student only
        if (role === 'student') {
            items.push({ id: 'explore', label: 'Discover', icon: 'explore' });
        }

        // Groups for Student, Teacher, Headmaster
        if (['student', 'teacher', 'headmaster'].includes(role)) {
            items.push({
                id: 'groups',
                label: 'Groups',
                icon: 'group',
                badge: unreadGroups > 0 ? unreadGroups : null
            });
        }

        // Library for Librarian, Teacher, Headmaster
        if (['librarian', 'teacher', 'headmaster'].includes(role)) {
            items.push({ id: 'library', label: 'Library', icon: 'book_2' });
        }

        // Profile for everyone
        items.push({ id: 'profile', label: 'Profile', icon: 'person' });

        return items;
    };

    const navItems = getNavItems();

    return (
        <div className="flex h-screen w-full bg-white lg:bg-slate-50 font-display text-slate-800 antialiased overflow-hidden">
            {/* Sidebar for Desktop */}
            <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 sticky top-0 h-screen p-6">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white text-3xl">
                        <span className="material-symbols-outlined !text-3xl">menu_book</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 italic">MasterBaca</h1>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map(item => (
                        <NavItem
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            badge={item.badge}
                            active={activeTab === item.id}
                            onClick={() => setActiveTab(item.id)}
                        />
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-slate-50">
                    <NavItem icon="settings" label="Settings" onClick={() => { }} />
                    <div className="mt-4 p-4 bg-primary/5 rounded-2xl flex items-center gap-3">
                        <img
                            src={user?.avatar_url || 'https://ui-avatars.com/api/?name=' + (user?.name || 'User')}
                            className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                            alt="avatar"
                        />
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'John Doe'}</p>
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-black">{role}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Wrapper */}
            <div className="relative flex flex-col flex-1 h-screen w-full max-w-md lg:max-w-none mx-auto lg:mx-0 shadow-2xl lg:shadow-none bg-white lg:bg-transparent overflow-hidden">
                {/* Header */}
                {!isChatOpen && (
                    <header className="flex-none flex items-center justify-between px-6 py-6 bg-white lg:bg-transparent lg:px-10 lg:py-8 z-40">
                        <div className="flex items-center gap-2 lg:hidden">
                            <span className="material-symbols-outlined text-primary text-3xl">menu_book</span>
                            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">MasterBaca</h1>
                        </div>
                        <div className="hidden lg:block text-slate-400 font-medium capitalize">
                            {activeTab} view
                        </div>
                        <div className="flex items-center gap-2">
                            {role === 'student' && (
                                <button
                                    onClick={onOpenAssistant}
                                    className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1.5 px-3 shadow-sm hover:shadow-md active:scale-95 transition-all"
                                >
                                    <span className="material-symbols-outlined text-[20px] font-bold">bolt</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">AI Profiler</span>
                                </button>
                            )}
                            <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
                                <span className="material-symbols-outlined text-slate-600">notifications</span>
                                <span className="absolute top-2.5 right-2.5 flex h-2 w-2 rounded-full bg-primary border-2 border-white"></span>
                            </button>
                        </div>
                    </header>
                )}

                {/* Content Area */}
                <main className={`flex-1 relative z-[2000] ${isChatOpen ? 'p-0 overflow-hidden' : 'px-4 lg:px-10 py-6 overflow-visible'}`}>
                    {children}
                </main>

                {/* Bottom Navigation for Mobile */}
                {!isChatOpen && (
                    <nav className="lg:hidden flex-none border-t border-slate-100 bg-white px-6 py-3 flex items-center justify-around pb-4 pt-4 z-40">
                        {navItems.map(item => (
                            <MobileNavItem
                                key={item.id}
                                icon={item.icon}
                                label={item.label}
                                badge={item.badge}
                                active={activeTab === item.id}
                                onClick={() => setActiveTab(item.id)}
                            />
                        ))}
                    </nav>
                )}
            </div>
        </div>
    );
};

const NavItem = ({ icon, label, active, onClick, badge }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 relative ${active
            ? 'bg-primary text-white shadow-lg shadow-primary/20'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
    >
        <span className={`material-symbols-outlined ${active ? 'fill-1' : ''}`}>{icon}</span>
        <span className="font-bold text-sm tracking-tight">{label}</span>
        {badge && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow-sm">
                {badge}
            </span>
        )}
    </button>
);

const MobileNavItem = ({ icon, label, active, onClick, badge }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center gap-1 transition-colors relative ${active ? 'text-primary' : 'text-slate-400 hover:text-primary'
            }`}
    >
        <div className="relative">
            <span className={`material-symbols-outlined ${active ? 'fill-1' : ''}`}>{icon}</span>
            {badge && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white animate-pulse">
                    {badge}
                </span>
            )}
        </div>
        <span className="text-[10px] font-bold tracking-tight">{label}</span>
    </button>
);

export default Layout;
