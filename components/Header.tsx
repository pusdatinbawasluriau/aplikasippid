
import React from 'react';
import { Settings } from '../types';

interface HeaderProps {
    onLogout: () => void;
    settings: Settings;
}

const Header: React.FC<HeaderProps> = ({ onLogout, settings }) => {
    return (
        <header className="flex justify-between items-center py-4 px-8 bg-white border-b border-slate-200 shadow-sm z-10">
            <div className="flex items-center">
                <div className="flex flex-col">
                    <h2 className="text-lg font-bold text-slate-800 leading-tight">Panel Administrasi</h2>
                    <p className="text-xs font-medium text-slate-500">PPID {settings.namaBawaslu}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end mr-2">
                    <span className="text-sm font-bold text-slate-700">Administrator</span>
                    <span className="text-[10px] text-green-500 font-bold flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                        Online
                    </span>
                </div>
                <button 
                    onClick={onLogout}
                    className="text-white bg-slate-800 hover:bg-slate-900 focus:ring-4 focus:outline-none focus:ring-slate-200 font-bold rounded-xl text-xs px-6 py-3 text-center transition-all shadow-md active:scale-95"
                >
                    Sign Out
                </button>
            </div>
        </header>
    );
};

export default Header;
