
import React, { useState } from 'react';
import { Settings } from '../types';

interface LoginProps {
    onLogin: () => void;
    settings: Settings;
}

const Login: React.FC<LoginProps> = ({ onLogin, settings }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'admin' && password === 'agustus2025') {
            setError('');
            onLogin();
        } else {
            setError('Username atau password salah.');
        }
    };

    const formatName = (name: string) => {
        if (name.toUpperCase().startsWith('BAWASLU ')) {
            return {
                prefix: 'PPID BAWASLU',
                region: name.substring(8)
            };
        }
        if (name.toUpperCase().startsWith('BADAN PENGAWAS PEMILIHAN UMUM ')) {
            return {
                prefix: 'PPID BAWASLU',
                region: name.substring(30)
            };
        }
        return {
            prefix: 'PPID',
            region: name
        };
    };

    const displayName = formatName(settings.namaBawaslu);

    return (
        <div className="min-h-screen flex items-stretch text-gray-800">
            {/* Left Orange Panel */}
            <div className="hidden md:flex w-full md:w-1/2 lg:w-2/5 bg-gradient-to-br from-orange-500 to-orange-600 items-center justify-center p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute w-[40rem] h-[40rem] lg:w-[50rem] lg:h-[50rem] bg-white/10 rounded-full -top-24 -left-32 animate-pulse"></div>
                <div className="absolute w-[30rem] h-[30rem] bg-black/5 rounded-full -bottom-24 -right-32"></div>

                <div className="z-10 text-center w-full">
                    {settings.logo && (
                      <div className="mb-6 flex justify-center">
                        <div className="w-24 h-24 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-xl">
                          <img src={settings.logo} alt="Logo" className="w-full h-full object-contain" />
                        </div>
                      </div>
                    )}
                    <h1 className="text-4xl lg:text-5xl font-extrabold mb-2 tracking-tight drop-shadow-md">
                        {displayName.prefix}
                    </h1>
                    <p className="text-xl lg:text-2xl mb-8 font-semibold opacity-90 uppercase">
                        {displayName.region}
                    </p>
                    <div className="w-16 h-1 bg-white/50 mx-auto mb-8 rounded-full"></div>
                    <p className="text-base lg:text-lg font-light tracking-wide italic">
                        Sistem Pelayanan Informasi Publik Terintegrasi
                    </p>
                </div>
            </div>

            {/* Right White Form Panel */}
            <div className="w-full md:w-1/2 lg:w-3/5 flex items-center justify-center bg-slate-50 p-6 sm:p-12">
                <div className="w-full max-w-sm bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold mb-2 text-slate-800">Portal Admin</h2>
                        <p className="text-slate-500 text-sm">Gunakan akun Anda untuk masuk ke sistem.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                         {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-sm rounded-r-lg flex items-center" role="alert">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <p>{error}</p>
                            </div>
                        )}
                        <div className="mb-5">
                            <label className="block text-slate-600 text-sm font-semibold mb-2" htmlFor="username">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="appearance-none border border-slate-200 rounded-xl w-full py-3.5 px-4 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                placeholder="Username"
                                required
                            />
                        </div>
                        <div className="mb-8">
                            <label className="block text-slate-600 text-sm font-semibold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none border border-slate-200 rounded-xl w-full py-3.5 px-4 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-4 rounded-xl focus:outline-none shadow-lg shadow-orange-500/30 transition-all duration-200 active:scale-[0.98]"
                        >
                            Masuk Ke Sistem
                        </button>
                    </form>
                    <p className="text-center text-slate-400 text-[10px] mt-12 uppercase tracking-widest font-bold">
                        © 2025 PPID {settings.namaBawaslu}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
