# Requirements: To-Do List Life Dashboard

## Overview
Static web app dengan tampilan premium Apple-inspired. Berjalan dengan membuka index.html langsung di browser — tidak perlu build, server, atau instalasi apapun.

## Tech Stack & Constraints
- **TC-1** HTML + CSS + Vanilla JavaScript only. Tidak boleh ada framework (React, Vue, jQuery, Bootstrap, dll).
- **TC-2** Penyimpanan hanya via browser localStorage. Tidak ada backend atau request ke server.
- **TC-3** Kompatibel di Chrome, Firefox, Edge, Safari.
- **NFR-1** Antarmuka bersih dan minimal; mudah digunakan; tidak perlu setup.
- **NFR-2** Load cepat; UI responsif; tidak ada lag saat update data.
- **NFR-3** Tampilan premium, hierarki visual jelas, tipografi mudah dibaca.
- **Folder** Hanya 1 file CSS di css/, hanya 1 file JS di js/. Tidak ada file/folder tambahan selain index.html, css/style.css, js/app.js, README.md, .kiro.

## Files
| File | Deskripsi |
|------|-----------|
| index.html | Struktur HTML, referensi ke CSS dan JS |
| css/style.css | Semua styling, CSS variables untuk tema |
| js/app.js | Semua logika, data, i18n — dalam satu IIFE |
| README.md | Dokumentasi singkat |

## Features

### 1. Greeting Card (full width)
- Jam live HH:MM:SS (besar, tipis, tabular-nums)
- Tanggal lengkap sesuai locale bahasa yang dipilih via Intl
- Sapaan berdasarkan jam: Pagi 05-11, Siang 12-17, Sore/Malam 18-21, Malam 22-04
- Nama kustom: klik untuk edit inline, Enter simpan, Esc batal, maks 30 karakter, disimpan di localStorage

### 2. Focus Timer (kartu tersendiri, konten rata tengah)
- Default 25:00, format MM:SS
- Tombol Start / Stop / Reset — tidak boleh membuat 2 interval sekaligus
- Timer pakai Date.now() end-timestamp (bukan decrement counter)
- Stepper −/+ dan preset 15/25/45/60 menit, range 1–120, tersimpan
- Kontrol durasi dinonaktifkan saat timer berjalan
- Reset kembali ke durasi yang dipilih (bukan hardcode 25)
- Tampilkan sisa waktu di document.title saat berjalan
- Saat 00:00: pulse halus pada kartu, tanpa suara

### 3. To-Do List
- Tambah tugas (tombol Add atau tekan Enter), abaikan input kosong
- Edit inline: klik teks tugas → input muncul, Enter simpan, Esc batal
- Tandai selesai (strike-through), hapus
- Semua data disimpan dan dipulihkan dari localStorage (dashboard.tasks)
- Struktur task: {id, text, done, createdAt}
- Empty state ramah: "No tasks yet. Enjoy the calm."

### 4. Quick Links
- Form nama + URL, tombol "Add Link" membuat tombol baru yang membuka tab baru
- Tombol (x) kecil untuk hapus tiap link
- Auto-prefix https:// jika tidak ada protokol
- Validasi URL; gunakan el="noopener noreferrer"
- 3 default saat pertama kali (Google, Gmail, Calendar) — tidak dibuat ulang setelah user mengubah
- Disimpan di localStorage (dashboard.links)

### 5. Light / Dark Theme
- Tombol toggle (SVG sun/moon) di pojok kanan atas
- Default sesuai prefers-color-scheme
- Disimpan di localStorage (dashboard.theme)
- Transisi warna halus

### 6. Language Selector (id, en, ja, de)
- Pill select kecil di pojok kanan atas, di sebelah kiri theme toggle
- Globe SVG + kode bahasa; ppearance:none + -webkit-appearance:none
- Default: tersimpan → 
avigator.language → en
- Disimpan di localStorage (dashboard.lang)
- pplyLanguage(code) memperbarui semua elemen [data-i18n] seketika
- Set document.documentElement.lang
- Tanggal di-format ulang via Intl sesuai locale
- Konten user (nama, tugas, link) tidak pernah diterjemahkan
- Font sistem Jepang: "Hiragino Sans", "Yu Gothic", "Noto Sans CJK JP"

**Terjemahan yang diimplementasikan:**

| Key | id | en | ja | de |
|-----|----|----|----|----|
| greeting.morning | Selamat Pagi | Good Morning | おはようございます | Guten Morgen |
| greeting.afternoon | Selamat Siang | Good Afternoon | こんにちは | Guten Tag |
| greeting.evening | Selamat Sore | Good Evening | こんばんは | Guten Abend |
| greeting.night | Selamat Malam | Good Night | おやすみなさい | Gute Nacht |
| timer.title | Timer Fokus | Focus Timer | 集中タイマー | Fokus-Timer |
| tasks.title | Daftar Tugas | To-Do List | やることリスト | Aufgabenliste |
| links.title | Tautan Cepat | Quick Links | クイックリンク | Schnellzugriff |

## Layout
`
[Language] [Theme]   ← pojok kanan atas, fixed

[ Greeting Card — full width        ]
[  Jam, Tanggal, Sapaan, Nama       ]

[ Focus Timer ]  [ To-Do List        ]
[ (centered)  ]  [ Tambah, list tugas]

[ Quick Links — full width           ]
`
Mobile: single column.

## Design System
- Warna via CSS variables (lihat :root dan [data-theme="dark"])
- Light: bg #f5f5f7, card putih, teks #1d1d1f, sekunder #86868b
- Dark: bg #000→#1c1c1e, surface #1c1c1e, teks #f5f5f7
- Aksen: iOS blue #007AFF (light) / #0A84FF (dark)
- Radius kartu: 24px, glass morphism (backdrop-filter blur 24px)
- Tombol pill, min 44px, primary = biru solid, secondary = abu-abu
- Animasi: 150–250ms cubic-bezier(0.22,1,0.36,1), hanya transform/opacity/warna
- Hormati prefers-reduced-motion

## localStorage Keys
| Key | Nilai |
|-----|-------|
| dashboard.theme | "light" / "dark" |
| dashboard.lang | "id" / "en" / "ja" / "de" |
| dashboard.name | string nama kustom |
| dashboard.duration | number (menit) |
| dashboard.tasks | JSON array tasks |
| dashboard.links | JSON array links |

## Accessibility
- HTML semantik: header, main, section, utton, label, ul/li
- ria-label pada tombol icon-only
- ria-live="polite" untuk timer
- :focus-visible rings
- Keyboard: Enter tambah/simpan, Esc batal, semua elemen dapat dicapai Tab