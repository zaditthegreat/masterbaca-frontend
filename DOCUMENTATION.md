# 📖 MasterBaca (Anti-Gravity) Backend Documentation

Dokumentasi ini menjelaskan arsitektur, skema database, dan spesifikasi API yang digunakan dalam sistem MasterBaca.

---

## 🏗️ Teknologi Utama
- **Framework**: Node.js & Express
- **Database**: PostgreSQL dengan ekstensi `pgvector`.
- **ORM**: Sequelize
- **AI Integration**: 
  - **Gemini Vision**: Ekstraksi data buku dari foto cover.
  - **Gemini 1.5/2.0**: Profiling minat baca & rekomendasi berbasis vector.
- **Security**: 
  - Password di-hash dengan `bcryptjs`.
  - Otentikasi menggunakan **JWT (JSON Web Token)**.

---

## 💾 Model Data (Database Schema)

### 1. User
| Field | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `name` | String | Nama lengkap pengguna |
| `email` | String | Alamat email (Unik) |
| `password` | String | Hashed password |
| `role` | Enum | `headmaster`, `teacher`, `librarian`, `student` |
| `avatar_url` | String | URL foto profil (avatar) pengguna (opsional) |

### 2. UserProfile
| Field | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `userId` | UUID | Foreign Key ke User |
| `reading_interest`| JSON | Array kategori favorit |
| `analysis` | Text | Penjelasan mendalam dari AI |
| `embedding` | Vector(768) | Koordinat minat dalam ruang vector |
| `onboarding_complete`| Boolean | Status kelengkapan profil |
| `last_assess_date` | Date | Tanggal terakhir asesmen AI |

### 3. Book
| Field | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `id` | Integer | Primary Key |
| `title` / `author` | String | Judul dan Penulis |
| `summary` | Text | Ringkasan lengkap |
| `short_summary` | String | Ringkasan satu kalimat |
| `genre` | String | Kategori buku |
| `embedding` | Vector(768) | Koordinat isi buku |
| `difficulty_level` | Enum | `beginner`, `intermediate`, `advanced` |
| `cover_url` | String | URL lokal foto cover buku (opsional) |

---

## 🔐 API Reference: Authentication
Base URL: `/api/auth`

### Register
- **Endpoint**: `POST /register`
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securepassword",
    "role": "student"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered successfully",
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "uuid-here",
      "name": "Jane Doe",
      "role": "student"
    }
  }
  ```

### Login
- **Endpoint**: `POST /login`
- **Request Body**: 
  ```json
  {
    "email": "jane@example.com",
    "password": "securepassword"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "uuid-here",
      "name": "Jane Doe",
      "role": "student"
    }
  }
  ```

---

## 📚 API Reference: Book Management
Base URL: `/api/books` (Auth Required)

### Upload Buku via AI
- **Endpoint**: `POST /upload`
- **Header**: `Content-Type: multipart/form-data`
- **Body**: 
  - `image` (File): Foto cover buku.
  - `qty` (Number): Jumlah stok fisik.
- **Logic**: AI mengekstrak data buku & membuat embedding vector secara otomatis.

### CRUD Buku
- **GET `/`**: Mengambil semua daftar buku.
- **GET `/:id`**: Detail buku beserta status `BookItems` (stok fisik).
- **PUT `/:id`**: Update data buku (Judul, Genre, dsb).
  - *Catatan: Jika Judul/Summary berubah, Vector Embedding akan diperbarui.*
- **DELETE `/:id`**: Menghapus buku (Cascading delete ke stok & grup baca).

---

## 🧭 API Reference: Student Experience
Base URL: `/api` (Auth Required)

### Profil Saya & Status Onboarding
- **Endpoint**: `GET /me`
- **Response**: 
  ```json
  {
    "user": { ... },
    "force_assess": true 
  }
  ```
- *`force_assess`: Jika true, frontend wajib menampilkan layar onboarding AI.*

### Upload Foto Profil (Avatar)
- **Endpoint**: `POST /me/avatar`
- **Header**: `Content-Type: multipart/form-data`
- **Body**: 
  - `image` (File): Gambar untuk diatur sebagai foto profil.
- **Response**:
  ```json
  {
    "message": "Avatar updated successfully",
    "avatar_url": "/uploads/avatar_123_456789.png"
  }
  ```

### Interaksi Profiling (Onboarding)
- **Endpoint**: `POST /profile/interact`
- **Request Body**: 
  ```json
  {
    "conversation": [
      { "question": "Apa genre kesukaanmu?", "answer": "Fiksi ilmiah" }
    ]
  }
  ```
- **Response**:
  Menghasilkan status selesainya profiling.
  ```json
  {
    "is_complete": false,
    "question": {
      "text": "Pertanyaan berikutnya...",
      "answer_type": "text",
      "options": []
    }
  }
  ```

### Timeline (Rekomendasi Vector)
- **Endpoint**: `GET /timeline`
- **Logic**: 
  - User Profil Lengkap: Diurutkan berdasarkan **kemiripan vector** (Cosine Distance).
  - User Baru: Memberikan **5 buku random**.
  - Buku yang sudah di-swipe tidak akan muncul kembali selama 72 jam.

### Swipe (Interaction)
- **Endpoint**: `POST /swipe`
- **Request Body**: 
  ```json
  {
    "bookId": 1,
    "direction": "right"
  }
  ```
- **Matchmaking**: Jika 3 siswa swipe "right" pada buku yang sama, `ReadingGroup` akan otomatis dibuat.

---

## 💬 API Reference: Chat & Groups
Base URL: `/api` (Auth Required)

### Lihat Grup Saya
- **Endpoint**: `GET /my-groups`
- **Response**:
  Daftar grup baca yang diikuti peserta (hanya informasi ringkas).
  ```json
  [
    {
      "id": 1,
      "title": "Sherlock Holmes",
      "cover_url": "/uploads/book_123.jpg"
    }
  ]
  ```

### Detail Grup
- **Endpoint**: `GET /groups/:id`
- **Response**:
  Data lengkap grup baca termasuk daftar anggota dan detail buku.
  ```json
  {
    "id": 1,
    "userIds": ["uuid-1", "uuid-2"],
    "bookItemId": "uuid-book-item",
    "dueDate": "2024-12-31T00:00:00.000Z",
    "createdAt": "2024-03-20T10:00:00.000Z",
    "updatedAt": "2024-03-20T10:00:00.000Z",
    "users": [
      { "id": "uuid-1", "name": "Budi", "avatar_url": "/uploads/budi.png" },
      { "id": "uuid-2", "name": "Andi", "avatar_url": null }
    ],
    "book": {
      "id": 1,
      "title": "Sherlock Holmes",
      "author": "Arthur Conan Doyle",
      "genre": "Mystery",
      "cover_url": "/uploads/book_123.jpg"
    }
  }
  ```

### Ambil Pesan Chat
- **Endpoint**: `GET /chat/:readingGroupId`
- **Response**:
  ```json
  [
    {
      "id": "uuid-message",
      "readingGroupId": 1,
      "senderId": "uuid-user-sender",
      "content": "Halo semua!",
      "User": {
        "id": "uuid-user-sender",
        "name": "Jane",
        "avatar_url": "/uploads/jane.png"
      }
    }
  ]
  ```

### Kirim Pesan
- **Endpoint**: `POST /chat/send`
- **Request Body**: 
  ```json
  {
    "readingGroupId": 1,
    "content": "Halo!"
  }
  ```

---

## 🛡️ Role Access Control
- **Headmaster**: Full access (termasuk CRUD User).
- **Teacher/Librarian**: Kelola buku & stok.
- **Student**: Swipe, Timeline, Chat, Profile.

---

## 📅 New Updates: 3/13/2026

### 🏫 Class & School Management
Sistem sekarang mendukung pengelompokan User ke dalam Kelas.
- **Siswa**: Terikat pada 1 Kelas (Many-to-One).
- **Guru**: Bisa mengajar di banyak kelas (Many-to-Many).
- **Endpoint Baru (Khusus Headmaster)**:
  - `GET /api/classes`: List semua kelas + daftar guru \& jumlah siswa.
  - `POST /api/classes`: Membuat kelas baru.
  - `POST /api/classes/assign-teacher`: Menugaskan guru ke kelas.
  - `POST /api/classes/unassign-teacher`: Melepas tugas guru dari kelas.
  - `POST /api/classes/assign-student`: Memasukkan siswa ke kelas.

### 🧠 Synchronized Individual Assessment (Merged with Chat)
Sistem asesmen rangkuman buku setelah diskusi grup selesai. Tanpa Socket.io (Pure Polling).

#### Flow:
1. **Ready Check**: User menekan "Selesaikan Rangkuman" (`POST /api/groups/:id/finish`).
2. **Integrated Polling**: Frontend melakukan polling pesan rutin ke `GET /api/chat/:readingGroupId`. Request ini sekarang secara otomatis memperbarui *heartbeat* user dan mengembalikan status sinkronisasi grup.
3. **Sync Logic**: Server mendeteksi user mana yang masih aktif. Jika semua user aktif sudah "Finish" (dan tetap online), status grup berubah ke `assessment` setelah countdown 30 detik.
4. **Individual Exam**: Setiap user mengerjakan ujian yang berbeda dari AI melalui `POST /api/groups/:id/interact`.

#### Endpoint Utama:
- `GET /api/chat/:readingGroupId`: Ambil pesan sekaligus update status aktif \& cek kesiapan grup.
- `POST /api/groups/:id/finish`: Menyatakan rangkuman selesai.
- `POST /api/groups/:id/interact`: Chat interaktif pribadai dengan AI untuk ujian.

#### Model Updates:
- **`ReadingGroupMember`**: Menyimpan status `finishedAt` (Timestamp), `lastPollingAt`, `assessmentConversation` (JSON), dan `assessmentScore` (Integer).
- **`ReadingGroup`**: Menyimpan `assessmentStatus` (`waiting`, `starting`, `assessment`, `finished`).
