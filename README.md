# Admin Panel - Author & Book (NestJS)

Halo! Ini project tugas/latihan saya bikin admin panel sederhana pakai **NestJS**. Konsepnya CRUD biasa buat ngatur data **Author** (penulis) dan **Book** (buku), terus ada login juga biar nggak sembarang orang bisa akses.

Saya sengaja bikin simpel, nggak pakai React/Vue atau framework CSS, view-nya pure HTML pakai **Handlebars (hbs)**. Tujuannya biar gampang dijelasin pas demo/sidang, dan biar saya sendiri paham alur datanya dari ujung ke ujung.

## Tech Stack

- **NestJS** - framework backend (TypeScript)
- **TypeORM** - ORM buat komunikasi ke database
- **SQLite** - database file lokal, nggak perlu install database server / Docker
- **Handlebars (hbs)** - template engine buat render HTML
- **express-session** - buat simpen status login (session-based auth)

## Kenapa Pakai Pola MVC

Project ini saya susun pakai pola **MVC** (Model - View - Controller) biar rapi dan gampang dijelasin:

| Bagian         | Lokasi                          | Fungsi                                          |
|----------------|----------------------------------|--------------------------------------------------|
| Model          | `*.entity.ts`                    | Definisi struktur data (tabel di database)       |
| View           | `views/*.hbs`                    | Tampilan HTML yang dikirim ke browser            |
| Controller     | `*.controller.ts`                | Nerima request dari browser, panggil service     |
| Repository/Service | `*.service.ts`               | Logic & query ke database (lewat TypeORM)        |

Jadi alurnya: **Browser → Controller → Service → Database**, lalu hasilnya dibalikin lagi lewat Controller ke **View (hbs)** buat ditampilin ke user.

## Desain Database

Ada 2 tabel: `author` dan `book`. Relasinya **One-to-Many**: satu Author bisa punya banyak Book, tapi satu Book cuma punya satu Author.

```
+----------------+          +----------------------+
|     author     |          |         book         |
+----------------+          +----------------------+
| id (PK)        |<---+     | id (PK)              |
| name           |    |     | title                |
| bio            |    +-----| authorId (FK)         |
+----------------+          | year                 |
                             +----------------------+

  author (1) -------- (N) book
```

- `author.id` jadi Primary Key
- `book.authorId` jadi Foreign Key yang nunjuk ke `author.id`
- Kalau Author dihapus, Book yang terkait ikut terhapus (`onDelete: CASCADE`)

## Fitur

1. **Login** - hardcoded username `admin`, password `admin123`, pakai session (bukan JWT, biar simpel)
2. **Auth Guard** - kalau belum login dan coba akses halaman Author/Book, otomatis di-redirect ke `/login`
3. **CRUD Author** - tambah, lihat list, lihat detail, edit, hapus
4. **CRUD Book** - tambah, lihat list, lihat detail, edit, hapus (pas tambah/edit, pilih Author dari dropdown)
5. **Search** - cari Author by nama, cari Book by judul (lewat query string `?q=...`)
6. Semua pakai form HTML biasa (method `GET`/`POST`), **nggak ada fetch/axios/AJAX**, jadi setiap submit beneran reload halaman seperti web tradisional

## Struktur Folder

```
src/
  auth/             -> modul login & auth guard
    auth.module.ts
    auth.controller.ts
    auth.service.ts
    auth.guard.ts
  authors/          -> modul Author (CRUD)
    author.entity.ts
    authors.controller.ts
    authors.service.ts
    authors.module.ts
  books/            -> modul Book (CRUD)
    book.entity.ts
    books.controller.ts
    books.service.ts
    books.module.ts
  app.module.ts     -> modul utama, daftarin TypeORM + semua modul
  main.ts           -> entry point, setup hbs, static file, session

views/
  login.hbs
  authors/
    index.hbs       -> list + search Author
    detail.hbs      -> detail 1 Author + daftar bukunya
    form.hbs        -> form tambah/edit Author
  books/
    index.hbs       -> list + search Book
    detail.hbs      -> detail 1 Book
    form.hbs        -> form tambah/edit Book

db.sqlite           -> file database (otomatis dibuat pas pertama run)
```

## Cara Menjalankan

1. Pastikan sudah install **Node.js** (disarankan versi 18 atau lebih baru)
2. Install semua dependency:

```bash
npm install
```

3. Jalankan dalam mode development (auto-restart kalau ada perubahan kode):

```bash
npm run start:dev
```

4. Buka browser ke:

```
http://localhost:3000
```

Otomatis akan diarahkan ke halaman login kalau belum login.

Database SQLite (`db.sqlite`) akan otomatis dibuat sendiri di root folder pas pertama kali jalan (`synchronize: true` di TypeORM), jadi nggak perlu setup database manual atau migration.

## Login

Username dan password di-hardcode (untuk keperluan latihan, belum connect ke database user):

```
Username : admin
Password : admin123
```

## Daftar Endpoint (buat testing di Postman)

Semua endpoint dibawah ini balikin **HTML page**, bukan JSON (kecuali pas redirect ya tetep dapet status 302 + header `Location`). Jadi pas testing di Postman, yang dicek bukan body JSON tapi status code-nya & isi HTML-nya.

> Penting: login dulu lewat `POST /login` di Postman (jangan lupa pastiin cookie/session disimpen otomatis sama Postman), baru endpoint lain bisa diakses. Kalau belum login bakal kena redirect (302) ke `/login` oleh `AuthGuard`.

| Method | Endpoint              | Keterangan                                   |
|--------|------------------------|-----------------------------------------------|
| GET    | `/login`               | Halaman login                                |
| POST   | `/login`                | Submit login (body: `username`, `password`) |
| POST   | `/logout`               | Logout, hapus session                        |
| GET    | `/authors`              | List author (support `?q=` buat search)      |
| GET    | `/authors/new`          | Form tambah author                           |
| POST   | `/authors`              | Submit tambah author (body: `name`, `bio`)   |
| GET    | `/authors/:id`          | Detail 1 author + daftar bukunya             |
| GET    | `/authors/:id/edit`     | Form edit author                             |
| POST   | `/authors/:id/edit`     | Submit edit author                           |
| POST   | `/authors/:id/delete`   | Hapus author (book terkait ikut terhapus)    |
| GET    | `/books`                | List book (support `?q=` buat search)        |
| GET    | `/books/new`            | Form tambah book                             |
| POST   | `/books`                | Submit tambah book (body: `title`, `year`, `authorId`) |
| GET    | `/books/:id`            | Detail 1 book                                |
| GET    | `/books/:id/edit`       | Form edit book                               |
| POST   | `/books/:id/edit`       | Submit edit book                             |
| POST   | `/books/:id/delete`     | Hapus book                                   |

## Implementasi Error Handling

Belum yang fancy-fancy, tapi udah ada beberapa lapis:

- Kalau akses `/authors/:id` atau `/books/:id` dengan id yang nggak ada di database, service (`authors.service.ts` / `books.service.ts`) lempar `NotFoundException` dari NestJS.
- Kalau login salah (`username`/`password` nggak match), nggak di-redirect tapi halaman login di-render ulang dengan pesan error (`error: 'Username atau password salah.'`), jadi user tahu kenapa gagal tanpa harus pindah halaman.
- Guard (`auth.guard.ts`) jadi lapis pertama: kalau belum login dan coba akses halaman Author/Book, langsung di-redirect ke `/login` sebelum sempat masuk ke controller/service (jadi nggak ada celah akses data tanpa login).

## Catatan

- Ini project latihan/tugas, jadi sengaja dibuat seminimal mungkin tanpa CSS framework atau library tambahan yang nggak perlu
- Validasi input masih basic (pakai `required` di HTML), belum ada validasi lanjutan kayak class-validator
- Password masih hardcoded di kode, kalau mau lanjut dikembangin baiknya disimpan di `.env` dan di-hash
- Screenshot aplikasi & video demo (login, CRUD, testing Postman, penjelasan MVC & error handling) belum dimasukkan ke README ini — itu bagian yang harus direkam manual pakai screen recorder sendiri, taruh link videonya disini kalau sudah jadi
