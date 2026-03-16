📖 MasterBaca AI — Frontend

Frontend aplikasi MasterBaca AI, platform literasi sosial berbasis AI yang mengubah pengalaman membaca siswa menjadi lebih kolaboratif, kompetitif, dan terpersonalisasi.

Aplikasi ini menyediakan antarmuka untuk discovery buku berbasis swipe, pembentukan kelompok membaca otomatis, diskusi grup, serta asesmen pemahaman individu berbasis AI.

🚀 Overview

MasterBaca AI dirancang untuk mengatasi rendahnya motivasi membaca siswa yang sering terjadi dalam sistem tugas rangkuman konvensional.
Melalui pendekatan social learning dynamics + AI personalization, frontend ini menjadi jembatan interaksi utama antara siswa, guru, pustakawan, dan sistem AI semantic backend.

Fitur utama frontend meliputi:

📚 Swipe-based book discovery (mirip social matching experience)

👥 Automatic reading group experience

💬 Real-time style discussion flow (polling based sync)

🧠 AI onboarding & reading interest assessment

📊 Progress & assessment insight dashboard

🏫 Role-based UI (Student / Teacher / Librarian / Headmaster)

🧠 Core Experience Flow

AI Book Ingestion (via backend)
Pustakawan mengunggah foto cover buku → sistem AI membuat metadata, ringkasan, dan vector semantic.

Student AI Onboarding
Siswa melakukan asesmen minat baca melalui percakapan interaktif.

Personalized Timeline
Frontend menampilkan rekomendasi buku berdasarkan vector similarity.

Swipe Interaction
Siswa swipe kanan / kiri untuk menunjukkan minat membaca.

Reading Group Matchmaking
Jika jumlah siswa yang tertarik pada buku yang sama memenuhi threshold → grup otomatis terbentuk.

Collaborative Reading Period
Siswa membaca buku fisik dan berdiskusi dalam grup melalui fitur chat.

Synchronized AI Assessment
Setelah diskusi selesai → siswa mengikuti ujian pemahaman individual berbatas waktu.

Teacher Insight Dashboard
Guru dapat memantau skor asesmen, kontribusi diskusi, dan progres literasi siswa.

🛠️ Tech Stack

React / Vite

Tailwind CSS

Axios

JWT Auth Session Handling

Polling-based realtime sync

Role-based state rendering

⚠️ This repository contains the frontend application only.
Core AI services and backend infrastructure are maintained privately as part of ongoing research and development.