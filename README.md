<div align="center">

# 🧾 Receipt Photobooth

**Cetak momenmu dalam bentuk receipt thermal yang kece.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white&style=flat-square)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white&style=flat-square)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)](https://tailwindcss.com)

*Photobooth berbasis browser — tidak perlu install apapun, langsung jalan di tab kamu.*

</div>

---

## ✨ Apa ini?

Receipt Photobooth adalah aplikasi web yang mengubah sesi foto langsung dari kamera kamu menjadi **struk bergaya thermal printer** yang siap diunduh, dibagikan, atau dicetak beneran.

Terinspirasi dari gaya photobooth kafe dan scrapbook vintage, tapi dieksekusi full digital — lengkap dengan animasi cetak yang realistis.

---

## 🎬 Cara Kerja

```
1. Pilih layout   →   2. Foto langsung   →   3. Cetak & download
   (1–4 frame)         dari kamera            sebagai file PNG HD
```

Pas kamu klik **Cetak**, animasi thermal printer muncul:
- Mesin printer 3D di tengah layar
- Struk **slide keluar** dari slot printer secara perlahan (3 detik, smooth di GPU)
- Scan line bergerak di atas kertas saat proses cetak
- LED berkedip kuning → hijau saat selesai
- Kertas "disobek" dengan efek shake di akhir

---

## 🗂️ Fitur

| Fitur | Detail |
|-------|--------|
| 📸 **Layout fleksibel** | 1, 2, 3, atau 4 frame dalam satu struk |
| 🎨 **Filter foto** | Original, Vintage, Bittersweet, OG Vintage, B&W |
| 🔄 **Flip kamera** | Ganti kamera depan/belakang kapan saja |
| 🔦 **Torch** | Nyalakan flash untuk kamera belakang |
| 📤 **Upload foto** | Bisa upload dari galeri, tidak harus pakai kamera |
| 🖨️ **Animasi print** | Thermal printer 3D + receipt slide animation |
| 💾 **Export HD** | File PNG 1280px, bukan sekadar screenshot |
| 🔊 **Suara** | Suara shutter, printer, dan sobek kertas |
| 📱 **Responsive** | Jalan di desktop maupun smartphone |

---

## 🚀 Jalankan Sendiri

**Prasyarat:** Node.js ≥ 18, pnpm (atau npm/yarn)

```bash
# Clone repo
git clone https://github.com/username/receipt-photobooth.git
cd receipt-photobooth

# Install dependencies
pnpm install

# Jalankan dev server
pnpm dev
```

Buka **http://localhost:5173** di browser, allow akses kamera, dan mulai sesi foto.

```bash
# Build untuk production
pnpm build

# Preview build
pnpm preview
```

---

## 🗃️ Struktur Project

```
src/
├── components/
│   ├── FrameSelector.tsx   # Halaman pilih layout + live preview struk
│   ├── CaptureScreen.tsx   # Kamera + countdown + filter
│   ├── ResultScreen.tsx    # Preview struk + tombol download
│   └── PrintingOverlay.tsx # Animasi full-screen thermal printer
├── utils/
│   └── sound.ts            # Web Audio API: shutter, printer, paper tear
├── types.ts                # FrameCount, PhotoFilter, Step, Photo
├── App.tsx                 # Layout utama + typewriter tagline
├── index.css               # Custom animations + Tailwind base
└── main.tsx                # Entry point
```

---

## 🛠️ Tech Stack

- **React 19** + **TypeScript 5.9** — UI dan logika
- **Vite 7** — build tool yang cepat
- **Tailwind CSS 3** — styling utility-first
- **Lucide React** — icon set
- **Web Audio API** — efek suara tanpa library eksternal
- **Canvas API** — generate gambar struk resolusi tinggi

---

## 🎨 Design Notes

- Palet: **Forest Green** (`#3D5245`) + **Warm Cream** (`#F7F5F0`) + **Terracotta** (`#C87A53`)
- Font: **Fredoka** (heading) + **Nunito** (body) via Google Fonts
- Animasi print menggunakan **CSS `@keyframes` + double `requestAnimationFrame`** agar berjalan di GPU compositor thread (tidak di-interrupt JS)
- Dekorasi polaroid mengambang di sisi layar pakai CSS `float-gentle` animation

---

## 📄 Lisensi

MIT — bebas dipakai, dimodifikasi, dan didistribusikan.

---

<div align="center">
  <sub>Made with ♥ · Receipt Photobooth v2.0</sub>
</div>
