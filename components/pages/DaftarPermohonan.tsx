
import React, { useState } from 'react';
import { Permohonan, Settings } from '../../types';
import { EyeIcon, PencilIcon, TrashIcon, DownloadIcon, WhatsappIcon, SearchIcon } from '../icons';
import Modal from '../Modal';

interface DaftarPermohonanProps {
    permohonanList: Permohonan[];
    onDelete: (id: string) => void;
    onStatusChange: (id: string, newStatus: string) => void;
    settings: Settings;
}

const DaftarPermohonan: React.FC<DaftarPermohonanProps> = ({ permohonanList, onDelete, onStatusChange, settings }) => {
    const [selectedPermohonan, setSelectedPermohonan] = useState<Permohonan | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleWhatsApp = (phone: string) => {
        let formattedPhone = phone.replace(/\D/g, '');
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '62' + formattedPhone.substring(1);
        } else if (!formattedPhone.startsWith('62')) {
            formattedPhone = '62' + formattedPhone;
        }
        window.open(`https://wa.me/${formattedPhone}`, '_blank');
    };

    const fileToDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleDownload = async (permohonan: Permohonan) => {
        // @ts-ignore
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const margin = 20;
        const pageWidth = 210;
        const pageHeight = 297;
        let y = 20;

        // --- Header Section ---
        doc.setFont("times", "bold");
        doc.setFontSize(14);
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
        
        doc.setLineWidth(0.5);
        doc.line(margin, y + 2, pageWidth - margin, y + 2);
        y += 12;

        // --- Title Section ---
        doc.setFontSize(12);
        doc.setFont("times", "bold");
        doc.text("FORMULIR PERMOHONAN INFORMASI PUBLIK", 105, y, { align: "center" });
        y += 6;
        doc.setFontSize(10);
        doc.setFont("times", "normal");
        doc.text(`Nomor Pendaftaran: ${permohonan.id}`, 105, y, { align: "center" });
        y += 15;

        // --- Content Section ---
        doc.setFontSize(11);
        const labelX = margin;
        const colonX = 85;
        const valueX = 90;
        const maxWidth = pageWidth - margin - valueX;

        const addField = (label: string, value: string) => {
            if (y > pageHeight - 50) {
                doc.addPage();
                y = 20;
            }
            doc.text(label, labelX, y);
            doc.text(":", colonX, y);
            const cleanValue = value || '-';
            const splitValue = doc.splitTextToSize(cleanValue, maxWidth);
            doc.text(splitValue, valueX, y);
            y += (splitValue.length * 6) + 4; 
        };

        const pekerjaanText = permohonan.pekerjaan === 'Lainnya' 
            ? (permohonan.pekerjaanLainnya || '-') 
            : permohonan.pekerjaan;

        addField("1. Nama Pemohon", permohonan.namaPemohon);
        addField("2. Alamat", permohonan.alamat);
        addField("3. Pekerjaan", pekerjaanText);
        addField("4. Nomor Telepon / Email", `${permohonan.noTelp} / ${permohonan.email}`);
        addField("5. Rincian Informasi", permohonan.rincianInformasi);
        addField("6. Tujuan Penggunaan Informasi", permohonan.tujuanPenggunaan);
        addField("7. Cara Memperoleh Informasi", permohonan.caraMemperoleh);
        addField("8. Mendapatkan Salinan Informasi", permohonan.salinan);
        addField("9. Cara Mendapat Salinan", permohonan.caraMendapatSalinan);

        // --- Signature Section ---
        y += 15;
        if (y > pageHeight - 50) {
            doc.addPage();
            y = 30;
        }
        const date = permohonan.tanggal || new Date().toLocaleDateString('id-ID');
        const leftSignX = margin + 30;
        const rightSignX = pageWidth - margin - 30;

        doc.text(`Pekanbaru, ${date}`, rightSignX, y, { align: "center" });
        y += 6;
        doc.text("Petugas Pelayanan,", leftSignX, y, { align: "center" });
        doc.text("Pemohon Informasi,", rightSignX, y, { align: "center" });
        y += 25;
        doc.text(`( ${permohonan.petugasPelayanan} )`, leftSignX, y, { align: "center" });
        doc.text(`( ${permohonan.namaPemohon} )`, rightSignX, y, { align: "center" });

        // --- Halaman Identitas ---
        if (permohonan.identitas) {
            try {
                const imgData = await fileToDataURL(permohonan.identitas);
                doc.addPage();
                y = 20;
                doc.setFont("times", "bold");
                doc.setFontSize(12);
                doc.text("LAMPIRAN: IDENTITAS PEMOHON", 105, y, { align: "center" });
                y += 15;
                
                // Standard ID Card size: 85.6mm x 53.98mm
                const imgW = 85.6;
                const imgH = 54;
                const imgX = (pageWidth - imgW) / 2;
                
                // Add border for the ID card area
                doc.setDrawColor(200, 200, 200);
                doc.rect(imgX - 1, y - 1, imgW + 2, imgH + 2);
                
                doc.addImage(imgData, 'JPEG', imgX, y, imgW, imgH);
                
                y += imgH + 15;
                doc.setFont("times", "italic");
                doc.setFontSize(10);
                doc.text("FOTO IDENTITAS (KTP/SIM/PASPOR)", 105, y, { align: "center" });
            } catch (err) {
                console.error("Gagal memuat gambar identitas", err);
            }
        }

        doc.save(`Formulir_Permohonan_${permohonan.id}.pdf`);
    };

    const handleDownloadCSV = () => {
        const dataToExport = filteredPermohonan;
        if (dataToExport.length === 0) {
            alert('Tidak ada data untuk diunduh.');
            return;
        }
        const headers = [
            'ID', 'Nama Pemohon', 'Jenis Kelamin', 'Alamat', 'Pekerjaan', 'Pekerjaan Lainnya',
            'No Telp', 'Email', 'Rincian Informasi', 'Tujuan Penggunaan', 'Cara Memperoleh',
            'Salinan', 'Cara Mendapat Salinan', 'Petugas', 'Tanggal', 'Status'
        ];
        const csvRows = [headers.join(',')];
        for (const row of dataToExport) {
            const values = [
                row.id, row.namaPemohon, row.jenisKelamin, row.alamat, row.pekerjaan, row.pekerjaanLainnya,
                row.noTelp, row.email, row.rincianInformasi, row.tujuanPenggunaan, row.caraMemperoleh,
                row.salinan, row.caraMendapatSalinan, row.petugasPelayanan, row.tanggal, row.status
            ].map(val => {
                const stringVal = String(val || '');
                return `"${stringVal.replace(/"/g, '""')}"`;
            });
            csvRows.push(values.join(','));
        }
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `Daftar_Permohonan_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const DetailRow = ({ label, value }: { label: string, value: React.ReactNode }) => (
        <tr className="border-b">
            <td className="py-2 px-4 bg-gray-50 font-semibold text-gray-600 w-1/3">{label}</td>
            <td className="py-2 px-4 text-gray-800">{value}</td>
        </tr>
    );

    const getStatusColorClass = (status: string) => {
        switch (status) {
            case 'Diberikan Seluruhnya': return 'bg-green-100 text-green-900 border-green-300 focus:ring-green-500';
            case 'Diberikan Sebagian': return 'bg-yellow-100 text-yellow-900 border-yellow-300 focus:ring-yellow-500';
            case 'Ditolak': return 'bg-red-100 text-red-900 border-red-300 focus:ring-red-500';
            default: return 'bg-blue-100 text-blue-900 border-blue-300 focus:ring-blue-500';
        }
    };

    const filteredPermohonan = permohonanList.filter(item => 
        item.namaPemohon.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h3 className="text-3xl font-semibold text-gray-700 mb-6">Daftar Permohonan Informasi</h3>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Cari Nama atau No. Register..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                </div>
                <button 
                    onClick={handleDownloadCSV}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors"
                >
                    <DownloadIcon className="h-5 w-5" />
                    Download CSV
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama Pemohon</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tanggal</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Petugas</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPermohonan.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-gray-500">
                                        {searchTerm ? 'Data tidak ditemukan.' : 'Belum ada permohonan yang masuk.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredPermohonan.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{item.id}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{item.namaPemohon}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{item.tanggal}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{item.petugasPelayanan}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <div className="relative">
                                                <select
                                                    value={item.status || 'Diproses'}
                                                    onChange={(e) => onStatusChange(item.id, e.target.value)}
                                                    className={`block appearance-none w-full py-1 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-xs font-semibold border ${getStatusColorClass(item.status || 'Diproses')}`}
                                                >
                                                    <option value="Diproses">Diproses</option>
                                                    <option value="Diberikan Seluruhnya">Diberikan Seluruhnya</option>
                                                    <option value="Diberikan Sebagian">Diberikan Sebagian</option>
                                                    <option value="Ditolak">Ditolak</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                <button onClick={() => setSelectedPermohonan(item)} className="text-blue-500 hover:text-blue-700 transition-colors" title="View"><EyeIcon className="w-5 h-5" /></button>
                                                <button onClick={() => alert('Fitur Edit belum tersedia.')} className="text-yellow-500 hover:text-yellow-700 transition-colors" title="Edit"><PencilIcon className="w-5 h-5" /></button>
                                                <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700 transition-colors" title="Delete"><TrashIcon className="w-5 h-5" /></button>
                                                <button onClick={() => handleDownload(item)} className="text-gray-500 hover:text-gray-700 transition-colors" title="Download"><DownloadIcon className="w-5 h-5" /></button>
                                                <button onClick={() => handleWhatsApp(item.noTelp)} className="text-green-500 hover:text-green-700 transition-colors" title="WhatsApp"><WhatsappIcon className="w-5 h-5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedPermohonan && (
                 <Modal isOpen={!!selectedPermohonan} onClose={() => setSelectedPermohonan(null)} maxWidth="max-w-4xl">
                    <div className="text-left">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Detail Permohonan</h3>
                        <div className="max-h-[70vh] overflow-y-auto">
                            <table className="w-full">
                                <tbody>
                                    <DetailRow label="ID Permohonan" value={selectedPermohonan.id} />
                                    <DetailRow label="Tanggal" value={selectedPermohonan.tanggal} />
                                    <DetailRow label="Nama Pemohon" value={selectedPermohonan.namaPemohon} />
                                    <DetailRow label="Status" value={
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColorClass(selectedPermohonan.status || 'Diproses')}`}>
                                            {selectedPermohonan.status || 'Diproses'}
                                        </span>
                                    } />
                                    <DetailRow label="Alamat" value={selectedPermohonan.alamat} />
                                    <DetailRow label="Pekerjaan" value={selectedPermohonan.pekerjaan === 'Lainnya' ? selectedPermohonan.pekerjaanLainnya : selectedPermohonan.pekerjaan} />
                                    <DetailRow label="No. Telp" value={selectedPermohonan.noTelp} />
                                    <DetailRow label="Email" value={selectedPermohonan.email} />
                                    <DetailRow label="Rincian Informasi" value={<p className="whitespace-pre-wrap">{selectedPermohonan.rincianInformasi}</p>} />
                                    <DetailRow label="Tujuan Penggunaan" value={<p className="whitespace-pre-wrap">{selectedPermohonan.tujuanPenggunaan}</p>} />
                                    <DetailRow label="Cara Memperoleh" value={selectedPermohonan.caraMemperoleh} />
                                    <DetailRow label="Salinan Berupa" value={selectedPermohonan.salinan} />
                                    <DetailRow label="Cara Mendapat Salinan" value={selectedPermohonan.caraMendapatSalinan} />
                                    <DetailRow label="Identitas" value={selectedPermohonan.identitas?.name || 'Tidak ada file'} />
                                    <DetailRow label="Petugas Pelayanan" value={selectedPermohonan.petugasPelayanan} />
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-6 text-right">
                             <button 
                                onClick={() => setSelectedPermohonan(null)}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default DaftarPermohonan;
