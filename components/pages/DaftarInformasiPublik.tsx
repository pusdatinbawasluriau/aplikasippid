
import React, { useState, useRef } from 'react';
import { InformasiPublik } from '../../types';
import Modal from '../Modal';
import { DocumentAddIcon, PencilIcon, TrashIcon, DownloadIcon, SearchIcon } from '../icons';

interface DaftarInformasiPublikProps {
    informasiList: InformasiPublik[];
    onAdd: (info: Omit<InformasiPublik, 'id'>) => void;
    onEdit: (id: string, info: Partial<InformasiPublik>) => void;
    onDelete: (id: string) => void;
}

const DaftarInformasiPublik: React.FC<DaftarInformasiPublikProps> = ({ informasiList, onAdd, onEdit, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    
    const [devisi, setDevisi] = useState('Pencegahan');
    const [judul, setJudul] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [tahun, setTahun] = useState(new Date().getFullYear().toString());
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const devisiOptions = [
        'Pencegahan',
        'SDM',
        'Penanganan pelanggaran',
        'Penyelesaian Sengketa',
        'Humas',
        'Hukum',
        'Data dan Informasi'
    ];

    const handleAddClick = () => {
        setIsEditing(false);
        setCurrentId(null);
        setJudul('');
        setDeskripsi('');
        setDevisi('Pencegahan');
        setTahun(new Date().getFullYear().toString());
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsModalOpen(true);
    };

    const handleEditClick = (item: InformasiPublik) => {
        setIsEditing(true);
        setCurrentId(item.id);
        setJudul(item.judul);
        setDeskripsi(item.deskripsi);
        setDevisi(item.devisi);
        setTahun(item.tahun);
        setFile(null); // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        let fileUrl = '#';
        
        // Use new file if uploaded, otherwise keep existing link if editing
        if (file) {
            fileUrl = URL.createObjectURL(file);
        } else if (isEditing && currentId) {
            const existingItem = informasiList.find(i => i.id === currentId);
            if (existingItem) {
                fileUrl = existingItem.link;
            }
        }

        if (isEditing && currentId) {
            onEdit(currentId, {
                judul,
                devisi,
                deskripsi,
                tahun,
                link: fileUrl
            });
        } else {
            onAdd({
                judul,
                devisi,
                deskripsi,
                tahun,
                link: fileUrl
            });
        }
        
        setIsModalOpen(false);
        
        // Reset form
        setJudul('');
        setDeskripsi('');
        setDevisi('Pencegahan');
        setTahun(new Date().getFullYear().toString());
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const filteredInformasi = informasiList.filter(item => 
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.judul.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h3 className="text-3xl font-semibold text-gray-700">Daftar Informasi Publik</h3>
                <button 
                    onClick={handleAddClick}
                    className="flex items-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md whitespace-nowrap"
                >
                    <DocumentAddIcon className="h-5 w-5 mr-2" />
                    Tambah Informasi
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Cari Nomor Register atau Judul..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No. Register</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Devisi</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Judul Informasi</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tahun</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInformasi.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-500">
                                        {searchTerm ? 'Data informasi tidak ditemukan.' : 'Belum ada data informasi publik.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredInformasi.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <span className="font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                                {item.id}
                                            </span>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{item.devisi}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="font-semibold text-gray-800">{item.judul}</p>
                                            <p className="text-gray-500 text-xs mt-1 truncate max-w-xs">{item.deskripsi}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{item.tahun}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                <button onClick={() => handleEditClick(item)} className="text-yellow-500 hover:text-yellow-700 transition-colors" title="Edit">
                                                    <PencilIcon className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700 transition-colors" title="Hapus">
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 transition-colors" title="Download">
                                                    <DownloadIcon className="w-5 h-5" />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Popup / Modal Tambah Informasi */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="max-w-xl">
                <div className="text-left">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
                        {isEditing ? 'Edit Informasi Publik' : 'Tambah Informasi Publik'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Devisi</label>
                            <select 
                                value={devisi} 
                                onChange={(e) => setDevisi(e.target.value)}
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                            >
                                {devisiOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Judul Informasi</label>
                            <input 
                                type="text" 
                                value={judul}
                                onChange={(e) => setJudul(e.target.value)}
                                required
                                placeholder="Masukkan judul dokumen"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Deskripsi</label>
                            <textarea 
                                value={deskripsi}
                                onChange={(e) => setDeskripsi(e.target.value)}
                                required
                                rows={3}
                                placeholder="Deskripsi singkat mengenai informasi ini..."
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Tahun</label>
                            <input 
                                type="number" 
                                value={tahun}
                                onChange={(e) => setTahun(e.target.value)}
                                required
                                min="2000"
                                max="2099"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                {isEditing ? 'Ganti Dokumen (Opsional)' : 'Upload Dokumen'}
                            </label>
                            <input 
                                type="file" 
                                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                                ref={fileInputRef}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                            />
                            <p className="mt-1 text-xs text-gray-500">Format: PDF, DOC, XLS (Maks. 5MB)</p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button 
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit"
                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                            >
                                {isEditing ? 'Perbarui' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default DaftarInformasiPublik;
