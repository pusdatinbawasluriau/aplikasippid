
import React from 'react';
import StatCard from '../StatCard';
import { DocumentTextIcon, ListIcon, ExclamationCircleIcon, CheckCircleIcon } from '../icons';
import { Permohonan, Keberatan, InformasiPublik } from '../../types';

interface BerandaProps {
    permohonanList: Permohonan[];
    keberatanList: Keberatan[];
    informasiPublikList: InformasiPublik[];
}

const Beranda: React.FC<BerandaProps> = ({ permohonanList, keberatanList, informasiPublikList }) => {

    // --- Helpers untuk menghitung statistik ---

    const countStatus = (list: any[], status: string) => list.filter(item => item.status === status).length;
    
    // Status Permohonan
    const diprosesCount = countStatus(permohonanList, 'Diproses');
    const diterimaPenuhCount = countStatus(permohonanList, 'Diberikan Seluruhnya');
    const diterimaSebagianCount = countStatus(permohonanList, 'Diberikan Sebagian');
    const ditolakCount = countStatus(permohonanList, 'Ditolak');

    // Status Keberatan
    const keberatanDiproses = countStatus(keberatanList, 'Diproses');
    const keberatanDiterima = countStatus(keberatanList, 'Diterima');
    const keberatanDitolak = countStatus(keberatanList, 'Ditolak');

    // Statistik Pekerjaan (Top 5)
    const pekerjaanStats: Record<string, number> = permohonanList.reduce((acc, curr) => {
        const job = curr.pekerjaan === 'Lainnya' ? (curr.pekerjaanLainnya || 'Lainnya') : curr.pekerjaan;
        acc[job] = (acc[job] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    const sortedPekerjaan = Object.entries(pekerjaanStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // Statistik Jenis Kelamin
    const genderStats: Record<string, number> = permohonanList.reduce((acc, curr) => {
        const gender = curr.jenisKelamin || 'Tidak Diketahui';
        acc[gender] = (acc[gender] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Statistik Bulanan (Tahun Ini)
    const monthlyStats: number[] = new Array(12).fill(0);
    permohonanList.forEach(p => {
        // Asumsi format tanggal 'dd/mm/yyyy' atau Date string standar
        let datePart = p.tanggal.split('/'); // dd/mm/yyyy
        let month = 0;
        let year = 0;
        
        if (datePart.length === 3) {
             month = parseInt(datePart[1]) - 1;
             year = parseInt(datePart[2]);
        } else {
            const d = new Date(p.tanggal);
            month = d.getMonth();
            year = d.getFullYear();
        }

        if (year === new Date().getFullYear()) {
            monthlyStats[month]++;
        }
    });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const maxMonthVal = Math.max(...monthlyStats, 5); // Minimum scale 5

    // Custom Simple Bar Component
    const BarChart: React.FC<{ label: string, value: number, max: number, color: string }> = ({ label, value, max, color }) => (
        <div className="flex flex-col items-center group">
            <div className="h-32 flex items-end w-full justify-center bg-gray-50 rounded-t relative">
                <div 
                    className={`w-4 md:w-6 rounded-t transition-all duration-500 ease-out ${color} group-hover:opacity-80 relative`} 
                    style={{ height: `${(value / max) * 100}%` }}
                >
                     <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        {value}
                    </span>
                </div>
            </div>
            <span className="text-xs text-gray-500 mt-2 font-medium">{label}</span>
        </div>
    );

    const lakiTotal = genderStats['Laki-laki'] || 0;
    const allTotal = permohonanList.length || 1;
    const lakiPercentage = (lakiTotal / allTotal) * 100;

    return (
        <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Statistik</h3>
            
            {/* 1. Ringkasan Utama */}
            <div className="grid gap-6 md:grid-cols-3">
                <StatCard 
                    title="Total Permohonan"
                    value={permohonanList.length}
                    icon={<ListIcon className="h-8 w-8 text-blue-50" />}
                    color="bg-blue-500"
                />
                <StatCard 
                    title="Total Keberatan"
                    value={keberatanList.length}
                    icon={<ExclamationCircleIcon className="h-8 w-8 text-red-50" />}
                    color="bg-red-500"
                />
                <StatCard 
                    title="Info Publik Terdaftar"
                    value={informasiPublikList.length}
                    icon={<DocumentTextIcon className="h-8 w-8 text-green-50" />}
                    color="bg-green-500"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                
                {/* 2. Statistik Bulanan (Grafik) */}
                <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
                    <h4 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">Grafik Permohonan (Tahun {new Date().getFullYear()})</h4>
                    <div className="grid grid-cols-12 gap-1 md:gap-2 items-end h-48 px-2">
                        {monthlyStats.map((val, idx) => (
                            <BarChart 
                                key={idx} 
                                label={monthNames[idx]} 
                                value={val} 
                                max={maxMonthVal} 
                                color="bg-orange-500" 
                            />
                        ))}
                    </div>
                </div>

                {/* 3. Detail Status Permohonan */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">Status Permohonan</h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                            <span className="font-medium text-blue-700">Diproses</span>
                            <span className="font-bold text-blue-800 text-lg">{diprosesCount}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                            <span className="font-medium text-green-700">Diberikan Penuh</span>
                            <span className="font-bold text-green-800 text-lg">{diterimaPenuhCount}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                            <span className="font-medium text-yellow-700">Diberikan Sebagian</span>
                            <span className="font-bold text-yellow-800 text-lg">{diterimaSebagianCount}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                            <span className="font-medium text-red-700">Ditolak</span>
                            <span className="font-bold text-red-800 text-lg">{ditolakCount}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                
                {/* 4. Statistik Pekerjaan */}
                <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
                    <h4 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">Statistik Berdasarkan Pekerjaan</h4>
                    <div className="space-y-3">
                        {sortedPekerjaan.length > 0 ? sortedPekerjaan.map(([job, count], idx) => {
                            const total = permohonanList.length;
                            const percent = ((count / total) * 100).toFixed(1);
                            return (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 font-medium">{job}</span>
                                        <span className="text-gray-800 font-bold">{count} ({percent}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${percent}%` }}></div>
                                    </div>
                                </div>
                            )
                        }) : (
                            <p className="text-gray-400 text-center py-4">Belum ada data pemohon.</p>
                        )}
                    </div>
                </div>

                {/* 5. Statistik Jenis Kelamin (Donut Chart Simple CSS) */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">Jenis Kelamin</h4>
                    <div className="flex flex-col items-center justify-center py-2">
                        <div className="relative w-32 h-32 rounded-full border-8 border-gray-100 flex items-center justify-center overflow-hidden mb-4 shadow-inner">
                            {/* Simple visualization using conic-gradient for Pie Chart effect */}
                            <div 
                                className="absolute inset-0 w-full h-full"
                                style={{
                                    background: `conic-gradient(#3B82F6 0% ${lakiPercentage}%, #EC4899 0% 100%)`
                                }}
                            ></div>
                            <div className="absolute w-20 h-20 bg-white rounded-full flex items-center justify-center z-10">
                                <span className="text-gray-400 text-xs">Total: {permohonanList.length}</span>
                            </div>
                        </div>
                        <div className="w-full space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                    <span>Laki-laki</span>
                                </div>
                                <span className="font-bold">{genderStats['Laki-laki'] || 0}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-pink-500"></span>
                                    <span>Perempuan</span>
                                </div>
                                <span className="font-bold">{genderStats['Perempuan'] || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. Statistik Keberatan */}
             <div className="bg-white p-6 rounded-lg shadow-md">
                 <h4 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">Status Pengajuan Keberatan</h4>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                     <div className="p-4 bg-gray-50 rounded border border-gray-100">
                         <h5 className="text-gray-500 text-sm uppercase">Diproses</h5>
                         <p className="text-2xl font-bold text-blue-600">{keberatanDiproses}</p>
                     </div>
                     <div className="p-4 bg-gray-50 rounded border border-gray-100">
                         <h5 className="text-gray-500 text-sm uppercase">Diterima</h5>
                         <p className="text-2xl font-bold text-green-600">{keberatanDiterima}</p>
                     </div>
                     <div className="p-4 bg-gray-50 rounded border border-gray-100">
                         <h5 className="text-gray-500 text-sm uppercase">Ditolak</h5>
                         <p className="text-2xl font-bold text-red-600">{keberatanDitolak}</p>
                     </div>
                 </div>
             </div>
        </div>
    );
};

export default Beranda;
