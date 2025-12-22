
import React, { useState, useRef } from 'react';
import { Settings } from '../../types';
import { CogIcon, TrashIcon } from '../icons';

interface PengaturanProps {
  settings: Settings;
  onUpdate: (newSettings: Settings) => void;
}

const Pengaturan: React.FC<PengaturanProps> = ({ settings, onUpdate }) => {
  const [formData, setFormData] = useState<Settings>({ ...settings });
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'petugasPelayanan') {
      setFormData(prev => ({ ...prev, petugasPelayanan: value.split(',').map(s => s.trim()) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setStatus('idle');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran logo maksimal 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, logo: event.target?.result as string }));
        setStatus('idle');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setFormData(prev => ({ ...prev, logo: undefined }));
    if (logoInputRef.current) logoInputRef.current.value = '';
    setStatus('idle');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    
    // Simulate slight delay for UX
    setTimeout(() => {
      onUpdate(formData);
      setStatus('saved');
    }, 500);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <CogIcon className="h-8 w-8 text-orange-600" />
        <h3 className="text-3xl font-bold text-gray-800">Pengaturan Aplikasi</h3>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Logo Section */}
          <div className="border-b border-slate-100 pb-8">
            <label className="block text-slate-700 text-sm font-bold mb-4 uppercase tracking-wider">Logo Lembaga</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-32 h-32 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative group">
                {formData.logo ? (
                  <>
                    <img src={formData.logo} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                    <button 
                      type="button"
                      onClick={removeLogo}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <TrashIcon className="h-6 w-6 text-white" />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <div className="text-slate-300 text-xs font-bold">TIDAK ADA LOGO</div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  ref={logoInputRef}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 transition-all cursor-pointer"
                />
                <p className="mt-2 text-xs text-slate-400">Direkomendasikan ukuran 512x512 px. Format PNG/JPG (Maks. 2MB)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-700 text-sm font-bold mb-2 uppercase tracking-wider">Nama Lembaga / Bawaslu</label>
              <input
                type="text"
                name="namaBawaslu"
                value={formData.namaBawaslu}
                onChange={handleChange}
                required
                className="appearance-none border border-slate-200 rounded-xl w-full py-3 px-4 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                placeholder="Contoh: BAWASLU PROVINSI RIAU"
              />
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-bold mb-2 uppercase tracking-wider">Nama Atasan PPID</label>
              <input
                type="text"
                name="namaAtasanPPID"
                value={formData.namaAtasanPPID}
                onChange={handleChange}
                required
                className="appearance-none border border-slate-200 rounded-xl w-full py-3 px-4 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                placeholder="Nama Lengkap Atasan"
              />
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-bold mb-2 uppercase tracking-wider">Nama Petugas PPID</label>
              <input
                type="text"
                name="namaPPID"
                value={formData.namaPPID}
                onChange={handleChange}
                required
                className="appearance-none border border-slate-200 rounded-xl w-full py-3 px-4 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                placeholder="Nama Petugas PPID"
              />
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-bold mb-2 uppercase tracking-wider">Daftar Petugas (Pisahkan Koma)</label>
              <input
                type="text"
                name="petugasPelayanan"
                value={formData.petugasPelayanan.join(', ')}
                onChange={handleChange}
                required
                className="appearance-none border border-slate-200 rounded-xl w-full py-3 px-4 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                placeholder="Petugas A, Petugas B"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 text-sm font-bold mb-2 uppercase tracking-wider">Alamat Kantor Lengkap</label>
            <textarea
              name="alamatKantor"
              value={formData.alamatKantor}
              onChange={handleChange}
              required
              rows={3}
              className="appearance-none border border-slate-200 rounded-xl w-full py-3 px-4 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              placeholder="Alamat lengkap kantor untuk kop surat"
            />
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
            <button
              type="submit"
              disabled={status === 'saving'}
              className={`bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-10 rounded-xl transition-all focus:outline-none shadow-lg shadow-orange-500/20 active:scale-95 ${status === 'saving' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {status === 'saving' ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            {status === 'saved' && (
              <div className="flex items-center text-green-600 font-bold text-sm animate-bounce">
                <span className="mr-2">✓</span>
                Pengaturan Berhasil Diperbarui
              </div>
            )}
          </div>
        </form>
      </div>

      <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-6 rounded-2xl max-w-4xl shadow-sm">
        <p className="text-blue-700 text-sm leading-relaxed">
          <strong>Catatan:</strong> Logo yang diunggah akan secara otomatis ditampilkan pada halaman login, sidebar menu, serta menjadi bagian dari KOP surat pada setiap dokumen PDF yang dicetak.
        </p>
      </div>
    </div>
  );
};

export default Pengaturan;
