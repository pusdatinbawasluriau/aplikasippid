
import React, { useState } from 'react';
import { Keberatan, Permohonan } from '../../types';

interface FormulirKeberatanProps {
    onSubmit: (keberatan: Keberatan) => void;
    permohonanList: Permohonan[];
}

const FormulirKeberatan: React.FC<FormulirKeberatanProps> = ({ onSubmit, permohonanList }) => {
    // Informasi Pengajuan
    const [noPermohonan, setNoPermohonan] = useState('');
    const [tujuanPenggunaan, setTujuanPenggunaan] = useState('');

    // Identitas Pemohon
    const [namaPemohon, setNamaPemohon] = useState('');
    const [alamatPemohon, setAlamatPemohon] = useState('');
    const [pekerjaanPemohon, setPekerjaanPemohon] = useState('');
    const [noTelpPemohon, setNoTelpPemohon] = useState('');

    // Identitas Kuasa Pemohon
    const [namaKuasa, setNamaKuasa] = useState('');
    const [alamatKuasa, setAlamatKuasa] = useState('');
    const [noTelpKuasa, setNoTelpKuasa] = useState('');

    // Alasan & Cara Pengajuan
    const [alasan, setAlasan] = useState('');
    const [caraPengajuan, setCaraPengajuan] = useState('Aplikasi PPID');

    const alasanOptions = [
        "Permohonan Informasi ditolak",
        "Informasi berkala tidak disediakan",
        "Permintaan Informasi tidak ditanggapi",
        "Permintaan Informasi ditanggapi tidak sebagaimana yang diminta",
        "Permintaan Informasi tidak dipenuhi",
        "Biaya yang dikenakan tidak wajar",
        "Informasi disampaikan melebihi jangka waktu yang ditentukan"
    ];

    const handleSearch = () => {
        if (!noPermohonan) {
            alert('Silakan masukkan Nomor Register Permohonan terlebih dahulu.');
            return;
        }

        const found = permohonanList.find(p => p.id === noPermohonan);

        if (found) {
            alert('Data ditemukan!');
            setTujuanPenggunaan(found.tujuanPenggunaan);
            setNamaPemohon(found.namaPemohon);
            setAlamatPemohon(found.alamat);
            
            // Handle pekerjaan (jika 'Lainnya', ambil dari pekerjaanLainnya)
            const pekerjaanFix = found.pekerjaan === 'Lainnya' && found.pekerjaanLainnya 
                ? found.pekerjaanLainnya 
                : found.pekerjaan;
            setPekerjaanPemohon(pekerjaanFix);
            
            setNoTelpPemohon(found.noTelp);
        } else {
            alert('Data tidak ditemukan. Silakan periksa kembali Nomor Register Anda.');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newKeberatan: Keberatan = {
            id: `KEB-${Date.now()}`,
            noPermohonan,
            tujuanPenggunaan,
            namaPemohon,
            alamatPemohon,
            pekerjaanPemohon,
            noTelpPemohon,
            namaKuasa,
            alamatKuasa,
            noTelpKuasa,
            alasan,
            caraPengajuan,
            tanggal: new Date().toLocaleDateString('id-ID'),
        };
        onSubmit(newKeberatan);
        
        // Reset Form
        setNoPermohonan('');
        setTujuanPenggunaan('');
        setNamaPemohon('');
        setAlamatPemohon('');
        setPekerjaanPemohon('');
        setNoTelpPemohon('');
        setNamaKuasa('');
        setAlamatKuasa('');
        setNoTelpKuasa('');
        setAlasan('');
        setCaraPengajuan('Aplikasi PPID');
    };

    return (
        <div>
            <h3 className="text-3xl font-semibold text-gray-700 mb-6">Formulir Pengajuan Keberatan Informasi</h3>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <form onSubmit={handleSubmit}>
                    
                    {/* A. Informasi Register & Pemohon */}
                    <div className="mb-8 border-b pb-6">
                        <h4 className="text-xl font-bold text-gray-800 mb-4 bg-orange-100 p-2 rounded">A. Informasi Pengajuan</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Nomor Register Permohonan Informasi</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={noPermohonan} 
                                        onChange={(e) => setNoPermohonan(e.target.value)} 
                                        required 
                                        placeholder="Contoh: PERM-..."
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleSearch}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                                    >
                                        Cari
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Tujuan Penggunaan Informasi</label>
                                <input 
                                    type="text" 
                                    value={tujuanPenggunaan} 
                                    onChange={(e) => setTujuanPenggunaan(e.target.value)} 
                                    required 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                />
                            </div>
                        </div>

                        {/* Identitas Pemohon */}
                        <h5 className="text-lg font-semibold text-gray-700 mb-3 mt-6 border-l-4 border-orange-500 pl-2">Identitas Pemohon</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Nama</label>
                                <input type="text" value={namaPemohon} onChange={(e) => setNamaPemohon(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Pekerjaan</label>
                                <input type="text" value={pekerjaanPemohon} onChange={(e) => setPekerjaanPemohon(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Nomor Telepon</label>
                                <input type="text" value={noTelpPemohon} onChange={(e) => setNoTelpPemohon(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Alamat</label>
                                <textarea value={alamatPemohon} onChange={(e) => setAlamatPemohon(e.target.value)} required rows={2} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                            </div>
                        </div>

                        {/* Identitas Kuasa Pemohon */}
                        <h5 className="text-lg font-semibold text-gray-700 mb-3 mt-6 border-l-4 border-gray-500 pl-2">Identitas Kuasa Pemohon (Jika Ada)</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Nama Kuasa</label>
                                <input type="text" value={namaKuasa} onChange={(e) => setNamaKuasa(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Nomor Telepon Kuasa</label>
                                <input type="text" value={noTelpKuasa} onChange={(e) => setNoTelpKuasa(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Alamat Kuasa</label>
                                <textarea value={alamatKuasa} onChange={(e) => setAlamatKuasa(e.target.value)} rows={2} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                            </div>
                        </div>
                    </div>

                    {/* B. Alasan Pengajuan Keberatan */}
                    <div className="mb-8 border-b pb-6">
                        <h4 className="text-xl font-bold text-gray-800 mb-4 bg-orange-100 p-2 rounded">B. Alasan Pengajuan Keberatan</h4>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Pilih Alasan</label>
                            <select 
                                value={alasan} 
                                onChange={(e) => setAlasan(e.target.value)} 
                                required 
                                className="shadow border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                            >
                                <option value="" disabled>-- Pilih Alasan Keberatan --</option>
                                {alasanOptions.map((opt, idx) => (
                                    <option key={idx} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Keberatan Diajukan Melalui */}
                    <div className="mb-8">
                        <h4 className="text-xl font-bold text-gray-800 mb-4 bg-orange-100 p-2 rounded">C. Keberatan Diajukan Melalui</h4>
                        <div className="flex flex-col gap-3 ml-2">
                            {['Datang Langsung', 'Surat', 'Aplikasi PPID'].map((method) => (
                                <label key={method} className="inline-flex items-center">
                                    <input 
                                        type="radio" 
                                        name="caraPengajuan" 
                                        value={method} 
                                        checked={caraPengajuan === method} 
                                        onChange={(e) => setCaraPengajuan(e.target.value)}
                                        className="form-radio h-5 w-5 text-orange-600"
                                    />
                                    <span className="ml-2 text-gray-700">{method}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline transition-colors text-lg">
                            Kirim Keberatan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormulirKeberatan;
