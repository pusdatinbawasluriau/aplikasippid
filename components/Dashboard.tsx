
import React, { useState, useCallback } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Beranda from './pages/Beranda';
import FormulirPermohonan from './pages/FormulirPermohonan';
import DaftarPermohonan from './pages/DaftarPermohonan';
import DaftarInformasiPublik from './pages/DaftarInformasiPublik';
import FormulirKeberatan from './pages/FormulirKeberatan';
import DaftarKeberatan from './pages/DaftarKeberatan';
import BuatSurat from './pages/BuatSurat';
import Pengaturan from './pages/Pengaturan';
import Modal from './Modal';
import { CheckCircleIcon, PrinterIcon } from './icons';
import { Page, Permohonan, Keberatan, InformasiPublik, Settings } from '../types';

interface DashboardProps {
  onLogout: () => void;
  settings: Settings;
  onUpdateSettings: (s: Settings) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, settings, onUpdateSettings }) => {
    const [activePage, setActivePage] = useState<Page>('beranda');
    const [permohonanList, setPermohonanList] = useState<Permohonan[]>([]);
    const [keberatanList, setKeberatanList] = useState<Keberatan[]>([]);
    const [lastPermohonan, setLastPermohonan] = useState<Permohonan | null>(null);

    const [informasiPublikList, setInformasiPublikList] = useState<InformasiPublik[]>([
      { id: 'REG-001', judul: 'Laporan Keuangan Tahunan 2023', devisi: 'Keuangan', deskripsi: 'Laporan detail penggunaan anggaran tahun 2023', tahun: '2023', link: '#' },
      { id: 'REG-002', judul: 'Rencana Strategis Bawaslu Riau', devisi: 'Perencanaan', deskripsi: 'Dokumen Renstra 2020-2024', tahun: '2020', link: '#' },
      { id: 'REG-003', judul: 'Data Pelanggaran Pemilu', devisi: 'Penanganan pelanggaran', deskripsi: 'Rekapitulasi pelanggaran pemilu tahun 2024', tahun: '2024', link: '#' },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setLastPermohonan(null);
        setActivePage('daftar-permohonan');
    };

    const addPermohonan = useCallback((permohonan: Permohonan) => {
      setPermohonanList(prev => [...prev, permohonan]);
      setLastPermohonan(permohonan);
      setIsModalOpen(true);
    }, []);

    const fileToDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const generateTandaTerimaPDF = async () => {
        if (!lastPermohonan) return;

        // @ts-ignore
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const margin = 20;
        const pageWidth = 210;
        let y = 20;

        if (settings.logo) {
            try {
                doc.addImage(settings.logo, 'PNG', margin, y - 5, 20, 20);
            } catch (e) {
                console.error("Could not add logo to PDF", e);
            }
        }

        doc.setFont("times", "bold");
        doc.setFontSize(14);
        const bawasluName = settings.namaBawaslu.toUpperCase();
        const bawasluSplit = doc.splitTextToSize(bawasluName, pageWidth - 80);
        bawasluSplit.forEach((line: string) => {
            doc.text(line, 115, y, { align: "center" });
            y += 6;
        });
        
        y += 2;
        doc.setFontSize(10);
        doc.setFont("times", "normal");
        const addressSplit = doc.splitTextToSize(settings.alamatKantor, pageWidth - 80);
        addressSplit.forEach((line: string) => {
            doc.text(line, 115, y, { align: "center" });
            y += 5;
        });
        
        y = Math.max(y, 40);
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);
        y += 10;

        doc.setFontSize(12);
        doc.setFont("times", "bold");
        doc.text("BUKTI PENDAFTARAN PERMOHONAN INFORMASI PUBLIK", 105, y, { align: "center" });
        y += 12;

        doc.setFontSize(11);
        doc.setFont("times", "normal");
        
        const addRow = (label: string, value: string) => {
            doc.text(label, margin, y);
            doc.text(":", margin + 50, y);
            const splitVal = doc.splitTextToSize(value || '-', pageWidth - margin - 75);
            doc.text(splitVal, margin + 55, y);
            y += (splitVal.length * 6) + 2;
        };

        addRow("Nomor Register", lastPermohonan.id);
        addRow("Tanggal Pendaftaran", lastPermohonan.tanggal);
        addRow("Nama Pemohon", lastPermohonan.namaPemohon);
        addRow("Alamat Pemohon", lastPermohonan.alamat);
        addRow("Rincian Informasi", lastPermohonan.rincianInformasi);
        addRow("Petugas Pelayanan", lastPermohonan.petugasPelayanan);

        y += 15;
        doc.text("Pekanbaru, " + lastPermohonan.tanggal, pageWidth - margin - 50, y, { align: "center" });
        y += 6;
        
        const signY = y;
        doc.text("Petugas Pelayanan,", margin + 30, signY, { align: "center" });
        doc.text("Pemohon Informasi,", pageWidth - margin - 50, signY, { align: "center" });
        
        y += 25;
        doc.setFont("times", "bold");
        doc.text(`( ${lastPermohonan.petugasPelayanan} )`, margin + 30, y, { align: "center" });
        doc.text(`( ${lastPermohonan.namaPemohon} )`, pageWidth - margin - 50, y, { align: "center" });

        if (lastPermohonan.identitas) {
            try {
                const imgData = await fileToDataURL(lastPermohonan.identitas);
                doc.addPage();
                y = 20;
                doc.setFont("times", "bold");
                doc.setFontSize(12);
                doc.text("FOTO IDENTITAS PEMOHON", 105, y, { align: "center" });
                y += 15;
                const imgW = 85.6;
                const imgH = 54;
                const imgX = (pageWidth - imgW) / 2;
                doc.setDrawColor(200, 200, 200);
                doc.rect(imgX - 1, y - 1, imgW + 2, imgH + 2);
                doc.addImage(imgData, 'JPEG', imgX, y, imgW, imgH);
            } catch (err) {
                console.error("Gagal cetak foto identitas di tanda terima", err);
            }
        }

        y = 280;
        doc.setFont("times", "italic");
        doc.setFontSize(8);
        doc.text(`* Bukti pendaftaran ini dihasilkan secara otomatis oleh Sistem PPID ${settings.namaBawaslu}.`, 105, y, { align: "center" });
        doc.save(`Tanda_Terima_${lastPermohonan.id}.pdf`);
    };

    const deletePermohonan = useCallback((id: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus permohonan ini?')) {
            setPermohonanList(prev => prev.filter(p => p.id !== id));
        }
    }, []);

    const updatePermohonanStatus = useCallback((id: string, newStatus: string) => {
        setPermohonanList(prev => prev.map(p => 
            p.id === id ? { ...p, status: newStatus } : p
        ));
    }, []);

    const addKeberatan = useCallback((keberatan: Keberatan) => {
        setKeberatanList(prev => [...prev, { ...keberatan, status: 'Diproses' }]);
        alert('Formulir keberatan berhasil dikirim!');
        setActivePage('daftar-keberatan');
      }, []);

    const deleteKeberatan = useCallback((id: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus pengajuan keberatan ini?')) {
            setKeberatanList(prev => prev.filter(k => k.id !== id));
        }
    }, []);

    const updateKeberatanStatus = useCallback((id: string, newStatus: string) => {
        setKeberatanList(prev => prev.map(k => 
            k.id === id ? { ...k, status: newStatus } : k
        ));
    }, []);

    const addInformasiPublik = useCallback((info: Omit<InformasiPublik, 'id'>) => {
        setInformasiPublikList(prev => {
            const nextNum = prev.length + 1;
            const newId = `REG-${String(nextNum).padStart(3, '0')}`;
            return [...prev, { ...info, id: newId }];
        });
    }, []);

    const updateInformasiPublik = useCallback((id: string, updatedInfo: Partial<InformasiPublik>) => {
        setInformasiPublikList(prev => prev.map(item => 
            item.id === id ? { ...item, ...updatedInfo } : item
        ));
    }, []);

    const deleteInformasiPublik = useCallback((id: string) => {
         if (window.confirm('Apakah Anda yakin ingin menghapus informasi ini?')) {
            setInformasiPublikList(prev => prev.filter(item => item.id !== id));
        }
    }, []);

    const renderPage = () => {
        switch (activePage) {
            case 'beranda':
                return <Beranda permohonanList={permohonanList} keberatanList={keberatanList} informasiPublikList={informasiPublikList} />;
            case 'formulir-permohonan':
                return <FormulirPermohonan onSubmit={addPermohonan} settings={settings} />;
            case 'daftar-permohonan':
                return <DaftarPermohonan permohonanList={permohonanList} onDelete={deletePermohonan} onStatusChange={updatePermohonanStatus} settings={settings} />;
            case 'daftar-informasi-publik':
                return <DaftarInformasiPublik informasiList={informasiPublikList} onAdd={addInformasiPublik} onEdit={updateInformasiPublik} onDelete={deleteInformasiPublik} />;
            case 'formulir-keberatan':
                return <FormulirKeberatan onSubmit={addKeberatan} permohonanList={permohonanList} />;
            case 'daftar-keberatan':
                return <DaftarKeberatan keberatanList={keberatanList} onDelete={deleteKeberatan} onStatusChange={updateKeberatanStatus} settings={settings} />;
            case 'buat-surat':
                return <BuatSurat permohonanList={permohonanList} keberatanList={keberatanList} settings={settings} />;
            case 'pengaturan':
                return <Pengaturan settings={settings} onUpdate={onUpdateSettings} />;
            default:
                return <Beranda permohonanList={permohonanList} keberatanList={keberatanList} informasiPublikList={informasiPublikList} />;
        }
    };

    return (
        <div className="flex h-screen bg-[#f1f5f9]">
            <Sidebar activePage={activePage} setActivePage={setActivePage} settings={settings} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onLogout={onLogout} settings={settings} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f1f5f9]">
                    <div className="container mx-auto px-6 py-8">
                        {renderPage()}
                    </div>
                </main>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} maxWidth="max-w-md">
                <div className="flex flex-col items-center p-2">
                    <CheckCircleIcon className="h-20 w-20 text-green-500 mb-6" />
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Berhasil!</h3>
                    <p className="text-slate-600 mb-8 text-center leading-relaxed">Permohonan informasi berhasil diregistrasi dengan nomor <strong>{lastPermohonan?.id}</strong>.</p>
                    
                    <div className="flex flex-col gap-3 w-full">
                        <button 
                            onClick={generateTandaTerimaPDF}
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-xl focus:outline-none transition-all shadow-lg shadow-blue-500/20"
                        >
                            <PrinterIcon className="h-5 w-5" />
                            Cetak Tanda Terima
                        </button>
                        <button 
                            onClick={handleCloseModal}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-4 rounded-xl focus:outline-none transition-all"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;
