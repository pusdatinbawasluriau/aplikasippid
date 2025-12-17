
import React, { useState } from 'react';
import { Keberatan } from '../../types';
import { EyeIcon, PencilIcon, TrashIcon, DownloadIcon, WhatsappIcon } from '../icons';
import Modal from '../Modal';

interface DaftarKeberatanProps {
    keberatanList: Keberatan[];
    onDelete: (id: string) => void;
    onStatusChange: (id: string, newStatus: string) => void;
}

const DaftarKeberatan: React.FC<DaftarKeberatanProps> = ({ keberatanList, onDelete, onStatusChange }) => {
    const [selectedKeberatan, setSelectedKeberatan] = useState<Keberatan | null>(null);

    const handleWhatsApp = (phone: string) => {
        if (!phone) {
            alert("Nomor telepon tidak tersedia.");
            return;
        }
        // Basic formatting
        let formattedPhone = phone.replace(/\D/g, '');
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '62' + formattedPhone.substring(1);
        } else if (!formattedPhone.startsWith('62')) {
            formattedPhone = '62' + formattedPhone;
        }
        window.open(`https://wa.me/${formattedPhone}`, '_blank');
    };

    const handleDownload = (keberatan: Keberatan) => {
        // @ts-ignore
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const margin = 20;
        const pageWidth = 210;
        let y = 20;

        // Header
        doc.setFont("times", "bold");
        doc.setFontSize(14);
        doc.text("BADAN PENGAWAS PEMILIHAN UMUM", 105, y, { align: "center" });
        y += 6;
        doc.text("PROVINSI RIAU", 105, y, { align: "center" });
        y += 10;
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);
        y += 10;

        // Title
        doc.setFontSize(12);
        doc.text("FORMULIR PENGAJUAN KEBERATAN INFORMASI", 105, y, { align: "center" });
        y += 6;
        doc.setFontSize(10);
        doc.setFont("times", "normal");
        doc.text(`Nomor Registrasi: ${keberatan.id}`, 105, y, { align: "center" });
        y += 15;

        // Content
        const labelX = margin;
        const colonX = 80;
        const valueX = 85;
        const maxWidth = pageWidth - margin - valueX;

        const addField = (label: string, value: string) => {
            doc.text(label, labelX, y);
            doc.text(":", colonX, y);
            const cleanValue = value || '-';
            const splitValue = doc.splitTextToSize(cleanValue, maxWidth);
            doc.text(splitValue, valueX, y);
            y += (splitValue.length * 6) + 2;
        };

        doc.setFont("times", "bold");
        doc.text("A. INFORMASI PENGAJUAN", margin, y);
        y += 6;
        doc.setFont("times", "normal");
        addField("No. Register Permohonan", keberatan.noPermohonan);
        addField("Tujuan Penggunaan", keberatan.tujuanPenggunaan);
        y += 4;

        doc.setFont("times", "bold");
        doc.text("B. IDENTITAS PEMOHON", margin, y);
        y += 6;
        doc.setFont("times", "normal");
        addField("Nama", keberatan.namaPemohon);
        addField("Alamat", keberatan.alamatPemohon);
        addField("Pekerjaan", keberatan.pekerjaanPemohon);
        addField("No. Telepon", keberatan.noTelpPemohon);
        y += 4;

        if (keberatan.namaKuasa) {
            doc.setFont("times", "bold");
            doc.text("C. IDENTITAS KUASA (Jika Ada)", margin, y);
            y += 6;
            doc.setFont("times", "normal");
            addField("Nama Kuasa", keberatan.namaKuasa);
            addField("Alamat Kuasa", keberatan.alamatKuasa);
            addField("No. Telp Kuasa", keberatan.noTelpKuasa);
            y += 4;
        }

        doc.setFont("times", "bold");
        doc.text("D. ALASAN KEBERATAN", margin, y);
        y += 6;
        doc.setFont("times", "normal");
        addField("Alasan", keberatan.alasan);
        y += 15;

        // Signature
        const rightSignX = pageWidth - margin - 30;
        doc.text(`Pekanbaru, ${keberatan.tanggal}`, rightSignX, y, { align: "center" });
        y += 6;
        doc.text("Pemohon / Kuasa,", rightSignX, y, { align: "center" });
        y += 25;
        doc.text(`( ${keberatan.namaPemohon} )`, rightSignX, y, { align: "center" });

        doc.save(`Keberatan_${keberatan.id}.pdf`);
    };

    const getStatusColorClass = (status: string) => {
        switch (status) {
            case 'Diterima':
                return 'bg-green-100 text-green-900 border-green-300';
            case 'Ditolak':
                return 'bg-red-100 text-red-900 border-red-300';
            case 'Diproses':
            default:
                return 'bg-yellow-100 text-yellow-900 border-yellow-300';
        }
    };

    const DetailRow = ({ label, value }: { label: string, value: React.ReactNode }) => (
        <tr className="border-b">
            <td className="py-2 px-4 bg-gray-50 font-semibold text-gray-600 w-1/3 align-top">{label}</td>
            <td className="py-2 px-4 text-gray-800 align-top">{value}</td>
        </tr>
    );

    return (
        <div>
            <h3 className="text-3xl font-semibold text-gray-700 mb-6">Daftar Pengajuan Keberatan</h3>
            <div className="bg-white rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No. Permohonan</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama Pemohon</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Alasan</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tanggal</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {keberatanList.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-gray-500">
                                        Belum ada pengajuan keberatan.
                                    </td>
                                </tr>
                            ) : (
                                keberatanList.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap font-medium">{item.noPermohonan}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{item.namaPemohon}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-600 text-xs truncate max-w-xs" title={item.alasan}>{item.alasan}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{item.tanggal}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                            <span className={`inline-block px-3 py-1 font-semibold leading-tight rounded-full text-xs ${getStatusColorClass(item.status || 'Diproses')}`}>
                                                {item.status || 'Diproses'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                <button onClick={() => setSelectedKeberatan(item)} className="text-blue-500 hover:text-blue-700 transition-colors" title="View / Ubah Status"><EyeIcon className="w-5 h-5" /></button>
                                                <button onClick={() => alert('Fitur Edit Data belum tersedia.')} className="text-yellow-500 hover:text-yellow-700 transition-colors" title="Edit"><PencilIcon className="w-5 h-5" /></button>
                                                <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700 transition-colors" title="Delete"><TrashIcon className="w-5 h-5" /></button>
                                                <button onClick={() => handleDownload(item)} className="text-gray-500 hover:text-gray-700 transition-colors" title="Download PDF"><DownloadIcon className="w-5 h-5" /></button>
                                                <button onClick={() => handleWhatsApp(item.noTelpPemohon)} className="text-green-500 hover:text-green-700 transition-colors" title="WhatsApp"><WhatsappIcon className="w-5 h-5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Detail / View / Change Status */}
            {selectedKeberatan && (
                <Modal isOpen={!!selectedKeberatan} onClose={() => setSelectedKeberatan(null)} maxWidth="max-w-4xl">
                    <div className="text-left">
                        <div className="flex justify-between items-center border-b pb-4 mb-4">
                            <h3 className="text-2xl font-bold text-gray-800">Detail Pengajuan Keberatan</h3>
                            
                            {/* Status Change in Header */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-600">Status:</span>
                                <select 
                                    value={selectedKeberatan.status || 'Diproses'} 
                                    onChange={(e) => {
                                        const newStatus = e.target.value;
                                        onStatusChange(selectedKeberatan.id, newStatus);
                                        // Update local state to reflect change immediately in modal
                                        setSelectedKeberatan({...selectedKeberatan, status: newStatus});
                                    }}
                                    className={`ml-2 py-1 px-3 rounded border text-sm font-semibold focus:outline-none ${getStatusColorClass(selectedKeberatan.status || 'Diproses')}`}
                                >
                                    <option value="Diproses">Diproses</option>
                                    <option value="Diterima">Diterima</option>
                                    <option value="Ditolak">Ditolak</option>
                                </select>
                            </div>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto pr-2">
                            <table className="w-full">
                                <tbody>
                                    <DetailRow label="ID Keberatan" value={selectedKeberatan.id} />
                                    <DetailRow label="No. Permohonan Awal" value={selectedKeberatan.noPermohonan} />
                                    <DetailRow label="Tujuan Penggunaan" value={selectedKeberatan.tujuanPenggunaan} />
                                    
                                    <tr className="bg-orange-50"><td colSpan={2} className="py-2 px-4 font-bold text-orange-800">Identitas Pemohon</td></tr>
                                    <DetailRow label="Nama Pemohon" value={selectedKeberatan.namaPemohon} />
                                    <DetailRow label="Alamat" value={selectedKeberatan.alamatPemohon} />
                                    <DetailRow label="Pekerjaan" value={selectedKeberatan.pekerjaanPemohon} />
                                    <DetailRow label="No. Telepon" value={selectedKeberatan.noTelpPemohon} />

                                    <tr className="bg-gray-200"><td colSpan={2} className="py-2 px-4 font-bold text-gray-800">Identitas Kuasa (Jika Ada)</td></tr>
                                    <DetailRow label="Nama Kuasa" value={selectedKeberatan.namaKuasa || '-'} />
                                    <DetailRow label="Alamat Kuasa" value={selectedKeberatan.alamatKuasa || '-'} />
                                    <DetailRow label="No. Telp Kuasa" value={selectedKeberatan.noTelpKuasa || '-'} />

                                    <tr className="bg-orange-50"><td colSpan={2} className="py-2 px-4 font-bold text-orange-800">Detail Keberatan</td></tr>
                                    <DetailRow label="Alasan Keberatan" value={selectedKeberatan.alasan} />
                                    <DetailRow label="Diajukan Melalui" value={selectedKeberatan.caraPengajuan} />
                                    <DetailRow label="Tanggal Pengajuan" value={selectedKeberatan.tanggal} />
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                             <button 
                                onClick={() => setSelectedKeberatan(null)}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
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

export default DaftarKeberatan;
