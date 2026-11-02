# Hallo BOPKRI — Frontend (`hallo-bopkri-fe`)

Aplikasi web antarmuka pengguna (**Frontend**) untuk **Hallo BOPKRI**, layanan terpadu pengaduan, aspirasi, pertanyaan, dan apresiasi masyarakat di lingkungan **Yayasan BOPKRI**.

Dibangun menggunakan **Next.js 16 (App Router)**, **React 19**, **TypeScript**, dan **Tailwind CSS v4**, serta dilengkapi lapisan *Backend-for-Frontend (BFF)* yang meneruskan permintaan ke server backend **NestJS** secara aman.

---

## Daftar Isi

1. [Fitur Utama](#fitur-utama)
2. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
3. [Panduan Instalasi & Menjalankan Proyek](#panduan-instalasi--menjalankan-proyek)
4. [Konfigurasi Environment (`.env.local`)](#konfigurasi-environment-envlocal)
5. [Panduan Login & Akses Panel Pengurus](#panduan-login--akses-panel-pengurus)
6. [Daftar Rute (URL) Aplikasi](#daftar-rute-url-aplikasi)
7. [Struktur Direktori](#struktur-direktori)
8. [Perintah NPM (Scripts)](#perintah-npm-scripts)

---

## Fitur Utama

### 1. Layanan Publik (Masyarakat)
- **Beranda Informasi (`/`)**: Penjelasan alur pengaduan, kategori laporan, dan pintasan layanan.
- **Kirim Aduan / Aspirasi (`/kirim-aduan`)**: Formulir pelaporan lengkap dengan dukungan lampiran berkas/foto, pratinjau sebelum kirim, serta pembuatan kode tiket otomatis (`CMP-`, `APP-`, `QUE-`).
- **Tiket Sementara di Sesi**: Kode tiket yang baru dikirim tersimpan sementara di sesi browser (default 5 menit) agar pelapor mudah menyalin kode tiketnya.
- **Lacak Tiket (`/lacak-aduan`)**: Pantau status tindak lanjut dan riwayat penanganan laporan secara *real-time* menggunakan kode tiket.

## Teknologi yang Digunakan

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Route Proxy)
- **UI Library**: [React 19](https://react.dev/)
- **Bahasa**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Ikon**: [Lucide React](https://lucide.dev/)

---

## Panduan Instalasi & Menjalankan Proyek

### 1. Prasyarat
- **Node.js** versi `20.x` atau lebih baru.
- Server **Backend Hallo BOPKRI (NestJS)** sudah berjalan (default di `http://localhost:4000`).

### 2. Instalasi Dependensi

```bash
npm install
```

### 3. Siapkan File `.env.local`
Buat file `.env.local` di direktori utama (*root*) proyek dan sesuaikan nilainya (lihat bagian [Konfigurasi Environment](#konfigurasi-environment-envlocal)).

### 4. Jalankan Server Development

```bash
npm run dev
```

## Panduan Login & Akses Panel Pengurus

Panel pengurus tidak ditampilkan pada navigasi publik demi keamanan. Berikut cara mengakses dan menggunakan sistem login pengurus:

### 1. Cara Membuka Halaman Login
Anda dapat membuka halaman login melalui salah satu alamat berikut di browser:
- **URL Utama Login**: [`http://localhost:3000/panel/login`](http://localhost:3000/panel/login)
- **URL Pintasan**: [`http://localhost:3000/login`](http://localhost:3000/login) atau [`http://localhost:3000/panel`](http://localhost:3000/panel) *(otomatis diarahkan ke `/panel/login` jika belum masuk)*

### 2. Langkah Login
1. Buka halaman `/panel/login`.
2. Masukkan **Username** dan **Password** akun pengurus atau bidang Anda (yang terdaftar di database backend NestJS).
3. Klik tombol **"Masuk ke Panel"**.
4. Sistem akan memverifikasi kredensial melalui endpoint internal `POST /api/auth/login` yang diteruskan ke backend NestJS (`/admin/auth/login`).
5. Jika valid, server menyimpan token akses ke dalam *HTTP-only cookie* (`TOKEN_COOKIE`) dan role aktif ke dalam cookie (`ROLE_COOKIE`), lalu mengarahkan Anda secara otomatis ke dashboard sesuai jabatan (*role*).

### 3. Pembagian Role & Tujuan Redirect Otomatis

Setelah berhasil login, pengguna otomatis diarahkan ke halaman masing-masing role:

| Role | Jabatan | Halaman Dashboard Default | Hak Akses Utama |
| :--- | :--- | :--- | :--- |
| `owner` | **Owner / Admin Utama** | `/panel/dashboard` | Melihat statistik penuh, mengelola semua aduan (`/panel/aduan`), mendisposisikan aduan ke bidang, mengunduh lampiran, dan mengelola master status (`/panel/status`). |
| `director` | **Direktur** | `/panel/director/dashboard` | Memantau statistik keseluruhan yayasan dan meninjau seluruh daftar aduan masuk lintas bidang (`/panel/director/aduan`) dalam mode pantau (*read-only*). |
| `manager` | **Manajer Bidang** | `/panel/manager/dashboard` | Memantau statistik bidangnya dan meninjau daftar aduan yang telah didisposisikan ke bidang tugasnya (`/panel/manager/aduan`). |

### 4. Proteksi Navigasi & Sesi (`proxy.ts`)
- **Belum Login**: Mencoba membuka rute `/panel/*` mana pun tanpa sesi aktif akan langsung diarahkan ke `/panel/login`.
- **Sudah Login**: Membuka `/panel/login` atau `/login` saat sesi masih aktif akan langsung diarahkan ke dashboard sesuai role pengguna.
- **Isolasi Antar-Role**: Pengguna dengan role `manager` atau `director` tidak dapat mengakses rute milik `owner` (`/panel/dashboard`), begitu pula sebaliknya—sistem otomatis mengembalikan pengguna ke dashboard role masing-masing.
- **Auto-Logout Inaktivitas**: Jika tab dibiarkan tanpa aktivitas (klik, ketik, *scroll*) melebihi batas `NEXT_PUBLIC_INACTIVITY_LIMIT_MS`, sistem otomatis menghapus sesi dan mengarahkan ke `/panel/login?expired=1` disertai pesan pemberitahuan sesi berakhir.
- **Logout Manual**: Klik tombol **"Keluar"** berwarna kuning di bagian bawah sidebar panel untuk menghapus sesi cookie dan kembali ke beranda publik (`/`).

---

## Daftar Rute (URL) Aplikasi

### Rute Publik
| Path | Keterangan |
| :--- | :--- |
| `/` | Halaman beranda publik Hallo BOPKRI |
| `/kirim-aduan` | Formulir pengiriman aduan, aspirasi, pertanyaan, atau apresiasi |
| `/lacak-aduan` | Halaman pelacakan status tiket laporan |

### Rute Panel Pengurus (`/panel/*`)
| Path | Role | Keterangan |
| :--- | :--- | :--- |
| `/panel/login` *(atau `/login`)* | Semua | Halaman Portal Login pengurus & bidang |
| `/panel/dashboard` | `owner` | Dashboard utama Owner |
| `/panel/aduan` | `owner` | Daftar seluruh aduan & fitur disposisi bidang |
| `/panel/aduan/[id]` | `owner` | Halaman detail aduan, riwayat, lampiran & pembaruan status |
| `/panel/status` | `owner` | Pengelolaan master status aduan |
| `/panel/director/dashboard` | `director` | Dashboard ringkasan Direktur |
| `/panel/director/aduan` | `director` | Daftar seluruh aduan untuk Direktur |
| `/panel/manager/dashboard` | `manager` | Dashboard ringkasan Manajer Bidang |
| `/panel/manager/aduan` | `manager` | Daftar aduan sesuai bidang Manajer |

---

## Struktur Direktori

```text
hallo-bopkri-fe/
├── app/
│   ├── api/                  # Route Handlers (BFF proxy ke backend NestJS)
│   │   ├── admin/[...path]/  # Proxy endpoint khusus admin (dengan Bearer token)
│   │   ├── auth/             # Endpoint login, logout, dan cek profil (/me)
│   │   └── public/[...path]/ # Proxy endpoint publik (kirim & lacak aduan)
│   ├── kirim-aduan/          # Halaman form pengiriman aduan publik
│   ├── lacak-aduan/          # Halaman pelacakan tiket publik
│   ├── panel/                # Seluruh halaman panel pengurus (Owner, Direktur, Manajer)
│   │   ├── login/            # Halaman login (/panel/login)
│   │   ├── dashboard/        # Dashboard Owner
│   │   ├── aduan/            # Daftar & detail aduan Owner
│   │   ├── status/           # Manajemen status aduan Owner
│   │   ├── director/         # Halaman khusus Direktur
│   │   └── manager/          # Halaman khusus Manajer Bidang
│   └── page.tsx              # Halaman beranda publik
├── components/
│   ├── admin/                # Komponen UI panel admin (auth, shell, dashboard, list, detail, status)
│   ├── feedback/             # Komponen notifikasi toast
│   ├── layout/               # Header, footer, dan navigasi publik
│   ├── public/               # Komponen form aduan, pelacakan tiket, dan modal publik
│   └── ui/                   # Provider dan komponen UI dasar
├── hooks/                    # Custom React hooks (use-auth, use-inactivity)
├── lib/                      # Helper API client, proxy backend, konstanta, dan session storage tiket
├── types/                    # Definisi tipe TypeScript (API, admin, tiket)
└── proxy.ts                  # Next.js 16 Proxy (proteksi autentikasi & otorisasi rute /panel/*)
```

---

## Perintah NPM (Scripts)

| Perintah | Fungsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server development di `http://localhost:3000` |
| `npm run build` | Mem-build aplikasi untuk produksi |
| `npm run start` | Menjalankan server hasil build produksi |
| `npm run lint` | Menjalankan pemeriksaan kode dengan ESLint |
