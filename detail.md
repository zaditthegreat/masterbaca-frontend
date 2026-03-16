# MasterBaca AI (Anti-Gravity)

### Nama Aplikasi / Project
**MasterBaca AI: Personalized Literacy & Collaborative Learning Ecosystem**

### Deskripsi Aplikasi / Project
MasterBaca AI adalah platform literasi digital revolusioner yang dirancang untuk mengubah pengalaman membaca membosankan menjadi petualangan sosial yang adiktif. Menggunakan teknologi **Vector Embedding** dan **AI Reasoning**, aplikasi ini secara otomatis menjodohkan pembaca berdasarkan "frekuensi otak" (minat & level pemahaman) dalam sebuah grup diskusi yang sinkron.

Aplikasi ini tidak hanya tentang membaca, tetapi tentang membangun ekosistem di mana AI bertindak sebagai Profiler, Kurator, dan Penguji (Examiner) yang memastikan setiap buku yang dibaca memberikan dampak maksimal bagi perkembangan intelektual siswa.

### Jelaskan masalah yang ingin diselesaikan dan bagaimana aplikasi ini menjadi solusinya.
**Masalah:**
1.  **Kurangnya Minat Baca:** Siswa sering dipaksa membaca buku yang tidak sesuai dengan minat atau kapasitas pemahaman mereka.
2.  **Literasi yang Pasif:** Membaca seringkali menjadi kegiatan soliter tanpa diskusi, sehingga materi sulit mengendap.
3.  **Beban Administratif Guru:** Guru kesulitan memantau pemahaman setiap siswa secara individual dalam waktu singkat, terutama dalam kegiatan literasi massal.

**Solusi MasterBaca AI:**
1.  **AI Profiler (Quick Assessment):** Mengganti survei panjang dengan chat interaktif AI yang memetakan *Brain Vector* siswa (kategori favorit, gaya bahasa, level kedalaman).
2.  **Vector-Matched Recommendation (Tinder-style):** Menggunakan UI kartu untuk mempermudah eksplorasi buku. Sistem secara otomatis membentuk grup baca (Reading Group) jika terdapat 3 siswa yang menyukai buku yang sama (Matchmaking).
3.  **Collaborative Chat & AI Examiner:** Menyediakan ruang diskusi grup yang tersinkronisasi. Setelah diskusi selesai, AI akan memberikan ujian berbeda untuk setiap individu guna memastikan tidak ada yang sekadar "menumpang nama" dalam grup.
4.  **Teacher/Staff Flow:** Guru dan Pustakawan dapat mengunggah buku hanya dengan memotret covernya. AI Vision akan otomatis mengekstraksi judul, penulis, genre, dan membuat ringkasan serta koordinat vector buku tersebut.

### Tools AI & LLM yang Digunakan
1.  **Antigravity (Google DeepMind):** Sebagai AI Coding Assistant utama yang merancang arsitektur frontend, logika state management, dan estetika UI premium.
2.  **Gemini 1.5/2.0 Pro:** Otak utama di balik *Vector Discovery*, *AI Profiling*, dan *Interactive Assessment*.
3.  **Gemini Vision:** Digunakan pada dashboard Staff untuk ekstraksi metadata buku dari citra cover secara otomatis.
4.  **pgvector (PostgreSQL):** Untuk penyimpanan dan pencarian kemiripan vector (Cosine Similarity) antara profil user dan konten buku.
5.  **Lucide React & Tailwind CSS:** Untuk implementasi micro-animations dan desain visual "Glassmorphism" yang premium.

### Ceritakan Proses "Vibecoding" Kamu
Proses pembangunan MasterBaca AI dilakukan dengan pendekatan **"Vibecoding"**, di mana instruksi diberikan dalam bahasa manusia yang natural untuk menciptakan harmoni antara fungsionalitas teknis dan estetika visual.

*   **Phase 1: Deep Understanding.** Dimulai dengan memahami bahwa literasi butuh "Vibe" sosial. Kita membangun sistem matchmaking yang terinspirasi dari aplikasi modern agar terasa *fresh* di mata siswa.
*   **Phase 2: Aesthetic First.** Saya memastikan setiap transisi, mulai dari kartu yang melayang, progress bar "SUKA/TIDAK SUKA" yang membulat, hingga mode gelap "AI Examiner" memberikan kesan teknologi tingkat tinggi (High-End).
*   **Phase 3: Logic Synchronization.** Kita tidak menggunakan cara konvensional. Kita membangun sistem *heartbeat* lewat polling cerdas untuk memastikan status asesi grup sinkron tanpa perlu infrastruktur WebSocket yang berat, menjaga aplikasi tetap ringan namun responsif.
*   **Phase 4: Experience-Driven Development.** Setiap fitur diuji berdasarkan "perasaan" pengguna. Contohnya, transisi dari chat ramah antar teman ke atmosfer ujian yang serius saat fase `Assessment` dimulai, menciptakan pengalaman psikologis yang unik bagi siswa.
