
import React, { useState, useCallback } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { Settings } from './types';

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    const [settings, setSettings] = useState<Settings>({
      namaBawaslu: 'BAWASLU PROVINSI RIAU',
      namaAtasanPPID: 'Rachmatul Azmi',
      namaPPID: 'H. Alnofrizal, S.E., M.I.Kom',
      alamatKantor: 'Jl. Sultan Syarif Kasim No. 119, Pekanbaru - Riau',
      petugasPelayanan: ['Nur Asiah', 'Rachmatul Azmi', 'Ahmad Ridwan']
    });

    const handleLogin = useCallback(() => {
        setIsLoggedIn(true);
    }, []);

    const handleLogout = useCallback(() => {
        setIsLoggedIn(false);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            {isLoggedIn ? (
                <Dashboard 
                    onLogout={handleLogout} 
                    settings={settings} 
                    onUpdateSettings={setSettings} 
                />
            ) : (
                <Login onLogin={handleLogin} settings={settings} />
            )}
        </div>
    );
};

export default App;
