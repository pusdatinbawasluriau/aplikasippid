
import React, { useState } from 'react';
import { Permohonan, Keberatan, Settings } from '../../types';
import { SearchIcon, PrinterIcon } from '../icons';

interface BuatSuratProps {
    permohonanList: Permohonan[];
    keberatanList: Keberatan[];
    settings: Settings;
}

const BuatSurat: React.FC<BuatSuratProps> = ({ permohonanList, keberatanList, settings }) => {
    const [jenisSurat, setJenisSurat] = useState<'permohonan' | 'keberatan'>('permohonan');
    const [searchId, setSearchId] = useState('');
    const [foundPermohonan, setFoundPermohonan] = useState<Permohonan | null>(null);
    const [foundKeberatan, setFoundKeberatan] = useState<Keberatan | null>(null);
    
    // Form States
    const [keputusan, setKeputusan] = useState('Diberikan Seluruhnya');
    const [alasan, setAlasan] = useState('');
    const [biaya, setBiaya] = useState('Rp 0,-');
    const [waktu, setWaktu] = useState('3 Hari Kerja');

    const handleSearch = () => {
        if (!searchId) {
            alert('Masukkan Nomor Register terlebih dahulu.');
            return;
        }

        if (jenisSurat === 'permohonan') {
            const found = permohonanList.find(p => p.id.toLowerCase() === searchId.toLowerCase());
            if (found) {
                setFoundPermohonan(found);
                setFoundKeberatan(null);
                setKeputusan(found.status === 'Diproses' ? 'Diberikan Seluruhnya' : found.status);
            } else {
                alert('Data permohonan tidak ditemukan.');
                setFoundPermohonan(null);
            }
        } else {
             const found = keberatanList.find(k => k.id.toLowerCase() === searchId.toLowerCase());
             if (found) {
                setFoundKeberatan(found);
                setFoundPermohonan(null);
                setKeputusan('Diterima'); 
            } else {
                alert('Data keberatan tidak ditemukan.');
                setFoundKeberatan(null);
            }
        }
    };

    const generatePDF = () => {
        if (jenisSurat === 'permohonan' && !foundPermohonan) return;
        if (jenisSurat === 'keberatan' && !foundKeberatan) return;

        // @ts-ignore
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const margin = 20;
        const pageWidth = 210;
        let y = 20;

        // --- KOP SURAT (DYNAMIS DARI SETTINGS) ---
        doc.setFont("times", "bold");
        doc.setFontSize(14);
        
        // Handle potentially long organization name
        const bawasluName = settings.namaBawaslu.toUpperCase();
        const bawasluSplit = doc.splitTextToSize(bawasluName, pageWidth - 40);
        bawasluSplit.forEach((line: string) => {
            doc.text(line, 105, y, { align: "center" });
            y += 6;
        });
        
        y += 2;
        doc.setFontSize(10);
        doc.setFont("times", "normal");
        const addressSplit = doc.splitTextToSize(settings.alamatKantor, pageWidth - 40);
        addressSplit.forEach((line: string) => {
            doc.text(line, 105, y, { align: "center" });
            y += 5;
        });
        
        y += 3;
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);
        y += 10;

        // --- HEADER ---
        const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        doc.setFontSize(11);
        doc.text(`Pekanbaru, ${today}`, pageWidth - margin, y, { align: "right" });
        y += 10;
        
        const noReg = jenisSurat === 'permohonan' ? foundPermohonan?.id : foundKeberatan?.id;
        doc.text(`Nomor     : 00${Math.floor(Math.random() * 100)}/PPID/RIAU/${new Date().getFullYear()}`, margin, y);
        y += 6;
        doc.text(`Lampiran : -`, margin, y);
        y += 6;
        doc.text(`Perihal    : ${jenisSurat === 'permohonan' ? 'Pemberitahuan Tertulis Permohonan Informasi' : 'Tanggapan Atas Keberatan'}`, margin, y);
        y += 15;

        // --- BODY ---
        const recipientName = jenisSurat === 'permohonan' ? foundPermohonan?.namaPemohon : foundKeberatan?.namaPemohon;
        doc.text("Kepada Yth,", margin, y);
        y += 6;
        doc.text(`Sdr/i ${recipientName}`, margin, y);
        y += 6;
        doc.text("di Tempat", margin, y);
        y += 10;

        const bodyIntro = jenisSurat === 'permohonan'
            ? `Menindaklanjuti Permohonan Informasi Publik dengan nomor register ${noReg}, bersama ini PPID Bawaslu Provinsi Riau menyampaikan hal-hal sebagai berikut:`
            : `Sehubungan dengan pengajuan keberatan informasi publik dengan nomor register ${noReg}, Atasan PPID Bawaslu Provinsi Riau memutuskan:`;

        const splitIntro = doc.splitTextToSize(bodyIntro, pageWidth - 2 * margin);
        doc.text(splitIntro, margin, y);
        y += (splitIntro.length * 6) + 4;

        // Detail Fields
        const addLine = (label: string, val: string) => {
            doc.text(`${label}`, margin + 5, y);
            const splitVal = doc.splitTextToSize(`: ${val}`, pageWidth - margin - 70);
            doc.text(splitVal, margin + 50, y);
            y += (splitVal.length * 6) + 2;
        };

        if (jenisSurat === 'permohonan') {
            addLine("1. Keputusan", keputusan);
            addLine("2. Informasi", foundPermohonan?.rincianInformasi || '-');
            addLine("3. Biaya Penyalinan", biaya);
            addLine("4. Waktu Penyediaan", waktu);
            if (alasan) {
                addLine("5. Keterangan", alasan);
            }
        } else {
             addLine("1. Keputusan Atasan", keputusan);
             addLine("2. Alasan", alasan || 'Sesuai dengan kajian hukum yang berlaku.');
        }

        y += 10;
        const closing = "Demikian surat pemberitahuan ini disampaikan untuk diketahui dan dimaklumi.";
        doc.text(closing, margin, y);
        y += 20;

        // --- SIGNATURE (DYNAMIS DARI SETTINGS) ---
        const signX = pageWidth - margin - 40;
        doc.text("PPID Bawaslu Riau,", signX, y, { align: "center" });
        y += 25;
        doc.setFont("times", "bold");
        doc.text(`( ${settings.namaPPID} )`, signX, y, { align: "center" });

        doc.save(`Surat_Resmi_${noReg}.pdf`);
    };

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <PrinterIcon className="h-8 w-8 text-orange-600" />
                <h3 className="text-2xl font-bold text-gray-800">Buat Surat Pemberitahuan</h3>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                
                {/* 1. Selection Cards */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-bold mb-3">Pilih Jenis Surat:</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div 
                            onClick={() => { setJenisSurat('permohonan'); setSearchId(''); setFoundPermohonan(null); }}
                            className={`cursor-pointer border rounded-lg p-5 transition-all duration-200 ${jenisSurat === 'permohonan' ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500 shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                        >
                            <h4 className={`font-bold text-lg mb-1 ${jenisSurat === 'permohonan' ? 'text-orange-700' : 'text-gray-700'}`}>Surat Pemberitahuan Tertulis</h4>
                            <p className="text-sm text-gray-500">Untuk merespon permohonan informasi (Diterima/Ditolak/Sebagian)</p>
                        </div>
                        
                        <div 
                            onClick={() => { setJenisSurat('keberatan'); setSearchId(''); setFoundKeberatan(null); }}
                            className={`cursor-pointer border rounded-lg p-5 transition-all duration-200 ${jenisSurat === 'keberatan' ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500 shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                        >
                            <h4 className={`font-bold text-lg mb-1 ${jenisSurat === 'keberatan' ? 'text-orange-700' : 'text-gray-700'}`}>Surat Tanggapan Keberatan</h4>
                            <p className="text-sm text-gray-500">Untuk merespon pengajuan keberatan pemohon</p>
                        </div>
                    </div>
                </div>

                {/* 2. Search Section */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-bold mb-2">
                        {jenisSurat === 'permohonan' ? 'Masukkan Nomor Register Permohonan (PERM-XXX)' : 'Masukkan Nomor Register Keberatan (KEB-XXX)'}
                    </label>
                    <div className="flex gap-0">
                        <input
                            type="text"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            placeholder={jenisSurat === 'permohonan' ? "Contoh: PERM-1234" : "Contoh: KEB-5678"}
                            className="shadow-sm border border-r-0 rounded-l w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all"
                        />
                        <button 
                            onClick={handleSearch}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-r focus:outline-none focus:shadow-outline transition-colors flex items-center justify-center"
                        >
                            <SearchIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* 3. Found Data Display */}
                {(foundPermohonan || foundKeberatan) && (
                    <div className="mb-6 bg-orange-50 border border-orange-200 rounded p-4 animate-scale-in">
                        <h5 className="font-bold text-gray-800 mb-3 border-b border-orange-200 pb-2">Data Ditemukan:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="block text-gray-500">Nama:</span>
                                <span className="font-semibold text-gray-800">{jenisSurat === 'permohonan' ? foundPermohonan?.namaPemohon : foundKeberatan?.namaPemohon}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500">Tanggal:</span>
                                <span className="font-semibold text-gray-800">{jenisSurat === 'permohonan' ? foundPermohonan?.tanggal : foundKeberatan?.tanggal}</span>
                            </div>
                            <div className="md:col-span-2">
                                <span className="block text-gray-500">Rincian Info / Alasan:</span>
                                <span className="font-semibold text-gray-800">{jenisSurat === 'permohonan' ? foundPermohonan?.rincianInformasi : foundKeberatan?.alasan}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. Decision Form */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Keputusan PPID</label>
                        <select
                            value={keputusan}
                            onChange={(e) => setKeputusan(e.target.value)}
                            className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
                        >
                            {jenisSurat === 'permohonan' ? (
                                <>
                                    <option value="Diberikan Seluruhnya">Diberikan Seluruhnya</option>
                                    <option value="Diberikan Sebagian">Diberikan Sebagian</option>
                                    <option value="Ditolak">Ditolak</option>
                                </>
                            ) : (
                                <>
                                    <option value="Diterima">Keberatan Diterima</option>
                                    <option value="Ditolak">Keberatan Ditolak</option>
                                </>
                            )}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Alasan / Penjelasan Tambahan</label>
                        <textarea
                            rows={3}
                            value={alasan}
                            onChange={(e) => setAlasan(e.target.value)}
                            className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-orange-500"
                            placeholder="Contoh: Informasi belum tersedia / Informasi dikecualikan..."
                        />
                    </div>

                    {jenisSurat === 'permohonan' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Biaya Penyalinan (Jika ada)</label>
                                <input
                                    type="text"
                                    value={biaya}
                                    onChange={(e) => setBiaya(e.target.value)}
                                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Waktu Penyediaan</label>
                                <input
                                    type="text"
                                    value={waktu}
                                    onChange={(e) => setWaktu(e.target.value)}
                                    placeholder="Contoh: 3 Hari Kerja"
                                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-orange-500"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* 5. Action Button */}
                <div className="mt-8">
                    <button
                        onClick={generatePDF}
                        disabled={!foundPermohonan && !foundKeberatan}
                        className={`w-full md:w-auto flex items-center justify-center gap-2 font-bold py-3 px-6 rounded shadow-md transition-colors ${
                            (foundPermohonan || foundKeberatan) 
                            ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        <PrinterIcon className="h-5 w-5" />
                        Cetak Surat Resmi
                    </button>
                </div>

            </div>
        </div>
    );
};

export default BuatSurat;
