
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

    // NavLink component
    const NavLink: React.FC<{ item: {id: string, label: string, icon: React.FC<{className?: string}>} }> = ({ item }) => {
        const isActive = activePage === item.id;
        return (
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    setActivePage(item.id as Page);
                }}
                className={`flex items-center px-6 py-3.5 text-sm transition-all duration-200 group ${
                    isActive
                        ? 'text-white bg-slate-800 border-l-4 border-orange-500 shadow-inner'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
            >
                <item.icon className={`h-5 w-5 transition-colors ${isActive ? 'text-orange-500' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className={`mx-4 font-medium ${isActive ? 'translate-x-1' : ''} transition-transform`}>{item.label}</span>
            </a>
        );
    };

    return (
        <div className="flex flex-col w-64 bg-slate-900 text-white shadow-2xl z-20">
            <div className="flex flex-col items-center justify-center py-8 border-b border-slate-800 px-4 bg-slate-900/50">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center shadow-lg mb-3 overflow-hidden border border-white/10">
                    {settings.logo ? (
                      <img src={settings.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                    ) : (
                      <div className="w-full h-full bg-orange-500 flex items-center justify-center">
                        <span className="text-3xl font-black text-white">B</span>
                      </div>
                    )}
                </div>
                <h1 className="text-lg font-bold text-white text-center leading-tight">PPID</h1>
                <div className="mt-1 text-center w-full">
                    <p className="text-[10px] text-orange-400 font-bold tracking-widest uppercase leading-tight px-2 break-words">
                        {settings.namaBawaslu}
                    </p>
                </div>
            </div>
            <nav className="mt-6 flex-1 overflow-y-auto scrollbar-hide">
                {menuItems.map((item) => <NavLink key={item.id} item={item} />)}
            </nav>
            <div className="p-4 bg-slate-900 border-t border-slate-800">
                <p className="text-[9px] text-slate-500 text-center">Versi 1.0.0 Integrated Service</p>
            </div>
        </div>
    );
};

export default Sidebar;
