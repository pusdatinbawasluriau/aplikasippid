
import React from 'react';
import { Page, Settings } from '../types';
import { HomeIcon, DocumentAddIcon, ListIcon, DocumentTextIcon, ExclamationCircleIcon, MailIcon, CogIcon } from './icons';

interface SidebarProps {
    activePage: Page;
    setActivePage: (page: Page) => void;
    settings: Settings;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, settings }) => {
    
    const menuItems = [
        { id: 'beranda', label: 'Beranda', icon: HomeIcon },
        { id: 'formulir-permohonan', label: 'Formulir Permohonan', icon: DocumentAddIcon },
        { id: 'daftar-permohonan', label: 'Daftar Permohonan', icon: ListIcon },
        { id: 'daftar-informasi-publik', label: 'Daftar Informasi Publik', icon: DocumentTextIcon },
        { id: 'formulir-keberatan', label: 'Formulir Keberatan', icon: ExclamationCircleIcon },
        { id: 'daftar-keberatan', label: 'Daftar Keberatan', icon: ListIcon },
        { id: 'buat-surat', label: 'Buat Surat Pemberitahuan', icon: MailIcon },
        { id: 'pengaturan', label: 'Pengaturan', icon: CogIcon },
    ];

    const NavLink: React.FC<{ item: {id: string, label: string, icon: React.FC<{className?: string}>} }> = ({ item }) => {
        const isActive = activePage === item.id;
        return (
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    setActivePage(item.id as Page);
                }}
                className={`flex items-center px-6 py-3.5 text-sm transition-all duration-200 group relative ${
                    isActive
                        ? 'text-white bg-[#1f2937] border-l-4 border-orange-500 shadow-lg'
                        : 'text-slate-400 hover:bg-[#1f2937]/50 hover:text-slate-200'
                }`}
            >
                <item.icon className={`h-5 w-5 transition-colors ${isActive ? 'text-orange-500' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className={`mx-4 font-semibold transition-transform ${isActive ? 'translate-x-1' : ''}`}>{item.label}</span>
                {isActive && (
                    <span className="absolute right-0 w-1 h-full bg-orange-500/20 blur-sm"></span>
                )}
            </a>
        );
    };

    return (
        <div className="flex flex-col w-64 bg-[#111827] text-white shadow-2xl z-20">
            <div className="flex flex-col items-center justify-center py-10 border-b border-slate-800/50 px-4">
                <div className="w-20 h-20 bg-white p-2 rounded-2xl shadow-xl mb-4 border border-slate-700/50">
                    {settings.logo ? (
                      <img src={settings.logo} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center rounded-lg">
                        <span className="text-4xl font-black text-white">B</span>
                      </div>
                    )}
                </div>
                <h1 className="text-xl font-black tracking-tighter text-white text-center leading-tight">PPID BAWASLU</h1>
                <div className="mt-1 text-center w-full">
                    <p className="text-[10px] text-orange-400 font-bold tracking-[0.2em] uppercase leading-tight px-2 break-words opacity-80">
                        {settings.namaBawaslu.replace('BAWASLU ', '')}
                    </p>
                </div>
            </div>
            <nav className="mt-6 flex-1 overflow-y-auto scrollbar-hide py-2">
                {menuItems.map((item) => <NavLink key={item.id} item={item} />)}
            </nav>
            <div className="p-4 bg-[#0d1117] border-t border-slate-800/50">
                <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">System Active</p>
                </div>
                <p className="text-[8px] text-slate-600 text-center">RIAU INTEGRATED SERVICE © 2025</p>
            </div>
        </div>
    );
};

export default Sidebar;
