
export interface Settings {
  namaBawaslu: string;
  namaAtasanPPID: string;
  namaPPID: string;
  alamatKantor: string;
  petugasPelayanan: string[];
  logo?: string; // Base64 string of the logo image
}

export interface Permohonan {
  id: string;
  namaPemohon: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  alamat: string;
  pekerjaan: string;
  pekerjaanLainnya?: string;
  noTelp: string;
  email: string;
  rincianInformasi: string;
  tujuanPenggunaan: string;
  caraMemperoleh: string;
  salinan: string;
  caraMendapatSalinan: string;
  identitas: File | null;
  petugasPelayanan: string;
  tanggal: string;
  status: string;
}

export interface Keberatan {
  id: string;
  noPermohonan: string;
  tujuanPenggunaan: string;
  // Identitas Pemohon
  namaPemohon: string;
  alamatPemohon: string;
  pekerjaanPemohon: string;
  noTelpPemohon: string;
  // Identitas Kuasa
  namaKuasa: string;
  alamatKuasa: string;
  noTelpKuasa: string;
  // Detail Keberatan
  alasan: string;
  caraPengajuan: string;
  tanggal: string;
  status?: string; // Status: Diproses, Diterima, Ditolak
}

export interface InformasiPublik {
  id: string; // Nomor Register
  judul: string;
  devisi: string;
  deskripsi: string;
  tahun: string;
  link: string; // Dummy link for download
}

export type Page = 
  'beranda' | 
  'formulir-permohonan' | 
  'daftar-permohonan' | 
  'daftar-informasi-publik' | 
  'formulir-keberatan' | 
  'daftar-keberatan' |
  'buat-surat' |
  'pengaturan';
