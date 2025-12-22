
import React, { useState, useRef, useEffect } from 'react';
import { Permohonan, Settings } from '../../types';

interface FormulirPermohonanProps {
    onSubmit: (permohonan: Permohonan) => void;
    settings: Settings;
}

const FormulirPermohonan: React.FC<FormulirPermohonanProps> = ({ onSubmit, settings }) => {
    const [namaPemohon, setNamaPemohon] = useState('');
    const [jenisKelamin, setJenisKelamin] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
    const [alamat, setAlamat] = useState('');
    const [pekerjaan, setPekerjaan] = useState('Mahasiswa');
    const [pekerjaanLainnya, setPekerjaanLainnya] = useState('');
    const [noTelp, setNoTelp] = useState('');
    const [email, setEmail] = useState('');
    const [rincianInformasi, setRincianInformasi] = useState('');
    const [tujuanPenggunaan, setTujuanPenggunaan] = useState('');
    const [caraMemperoleh, setCaraMemperoleh] = useState('Melihat');
    const [salinan, setSalinan] = useState('Softcopy');
    const [caraMendapatSalinan, setCaraMendapatSalinan] = useState('Email');
    const [identitas, setIdentitas] = useState<File | null>(null);
    const [petugasPelayanan, setPetugasPelayanan] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Default petugas if not set
    useEffect(() => {
        if (settings.petugasPelayanan.length > 0 && !petugasPelayanan) {
            setPetugasPelayanan(settings.petugasPelayanan[0]);
        }
    }, [settings.petugasPelayanan, petugasPelayanan]);

    const resetForm = () => {
        setNamaPemohon('');
        setJenisKelamin('Laki-laki');
        setAlamat('');
        setPekerjaan('Mahasiswa');
        setPekerjaanLainnya('');
        setNoTelp('');
        setEmail('');
        setRincianInformasi('');
        setTujuanPenggunaan('');
        setCaraMemperoleh('Melihat');
        setSalinan('Softcopy');
        setCaraMendapatSalinan('Email');
        setIdentitas(null);
        setPetugasPelayanan(settings.petugasPelayanan[0] || '');
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newPermohonan: Permohonan = {
            id: `PERM-${Date.now()}`,
            namaPemohon,
            jenisKelamin,
            alamat,
            pekerjaan,
            ...(pekerjaan === 'Lainnya' && { pekerjaanLainnya }),
            noTelp,
            email,
            rincianInformasi,
            tujuanPenggunaan,
            caraMemperoleh,
            salinan,
            caraMendapatSalinan,
            identitas,
            petugasPelayanan,
            tanggal: new Date().toLocaleDateString('id-ID'),
            status: 'Diproses'
        };
        onSubmit(newPermohonan);
        resetForm();
    };

    const renderInputField = (label: string, id: string, type: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required = true) => (
        <div className="mb-4">
            <label htmlFor={id} className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
            <input type={type} id={id} value={value} onChange={onChange} required={required} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-orange-500" />
        </div>
    );
    
    const renderTextareaField = (label: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, required = true) => (
        <div className="mb-4">
            <label htmlFor={id} className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
            <textarea id={id} value={value} onChange={onChange} required={required} rows={3} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-orange-500" />
        </div>
    );
    
    const renderSelectField = (label: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[]) => (
        <div className="mb-4">
            <label htmlFor={id} className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
            <select id={id} value={value} onChange={onChange} className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white">
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );
    
    return (
        <div>
            <h3 className="text-3xl font-semibold text-gray-700 mb-6">Formulir Permohonan Informasi</h3>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderInputField('Nama Pemohon', 'namaPemohon', 'text', namaPemohon, (e) => setNamaPemohon(e.target.value))}
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Jenis Kelamin</label>
                            <select 
                                value={jenisKelamin} 
                                onChange={(e) => setJenisKelamin(e.target.value as 'Laki-laki' | 'Perempuan')} 
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
                            >
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                            </select>
                        </div>

                        {renderInputField('No. Telp', 'noTelp', 'tel', noTelp, (e) => setNoTelp(e.target.value))}
                        {renderInputField('Email', 'email', 'email', email, (e) => setEmail(e.target.value))}
                        
                        <div>
                            {renderSelectField('Pekerjaan', 'pekerjaan', pekerjaan, (e) => setPekerjaan(e.target.value), ['Mahasiswa', 'LSM', 'Instansi Pemerintah', 'Masyarakat', 'Lainnya'])}
                            {pekerjaan === 'Lainnya' && (
                                <div className="mt-2">
                                    <input type="text" placeholder="Sebutkan pekerjaan" value={pekerjaanLainnya} onChange={(e) => setPekerjaanLainnya(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-orange-500" required />
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        {renderTextareaField('Alamat', 'alamat', alamat, (e) => setAlamat(e.target.value))}
                        {renderTextareaField('Rincian Informasi yang Dibutuhkan', 'rincian', rincianInformasi, (e) => setRincianInformasi(e.target.value))}
                        {renderTextareaField('Tujuan Penggunaan Informasi', 'tujuan', tujuanPenggunaan, (e) => setTujuanPenggunaan(e.target.value))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        {renderSelectField('Cara Memperoleh Informasi', 'caraMemperoleh', caraMemperoleh, (e) => setCaraMemperoleh(e.target.value), ['Melihat', 'Membaca', 'Mencatat', 'Mendengarkan'])}
                        {renderSelectField('Salinan Informasi Berupa', 'salinan', salinan, (e) => setSalinan(e.target.value), ['Hardcopy', 'Softcopy'])}
                        {renderSelectField('Cara Mendapat Salinan', 'caraMendapatSalinan', caraMendapatSalinan, (e) => setCaraMendapatSalinan(e.target.value), ['Mengambil Langsung', 'Kurir', 'Pos', 'Email', 'Whatsapp'])}
                        {renderSelectField('Petugas Pelayanan', 'petugas', petugasPelayanan, (e) => setPetugasPelayanan(e.target.value), settings.petugasPelayanan)}
                    </div>

                    <div className="mt-4">
                        <label htmlFor="identitas" className="block text-gray-700 text-sm font-bold mb-2">Upload Identitas (KTP/SIM)</label>
                        <input ref={fileInputRef} type="file" id="identitas" onChange={(e) => setIdentitas(e.target.files ? e.target.files[0] : null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors shadow-md">
                            Kirim Permohonan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormulirPermohonan;
