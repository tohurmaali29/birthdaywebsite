## Spreadsheet Setup

Project ini sudah siap kirim isi form wish ke Google Spreadsheet.

### 1. Buat spreadsheet

1. Buka Google Sheets.
2. Buat file baru, misalnya `Arabday Wishes`.
3. Di sheet pertama, isi header baris 1:

`submitted_at | wish`

### 2. Pasang Apps Script

1. Di Google Sheets, buka `Extensions -> Apps Script`.
2. Hapus isi default.
3. Copy isi dari file [google-apps-script.gs](/c:/ALI_PROJECTS/arabday/google-apps-script.gs).
4. Ganti `SHEET_NAME` kalau nama sheet kamu beda.
5. Save project.

### 3. Deploy endpoint

1. Klik `Deploy -> New deployment`.
2. Type: `Web app`.
3. Execute as: `Me`.
4. Who has access: `Anyone`.
5. Klik `Deploy`.
6. Copy URL web app yang berakhiran `/exec`.

### 4. Tempel endpoint ke web

Buka [index.html](/c:/ALI_PROJECTS/arabday/index.html:682) lalu ganti:

`data-endpoint="PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE"`

menjadi URL web app kamu, contoh:

`data-endpoint="https://script.google.com/macros/s/AKfycb.../exec"`

### 5. Test

1. Buka website.
2. Buka letter.
3. Tutup letter sampai form wish muncul.
4. Isi wish lalu submit.
5. Cek spreadsheet, harusnya masuk baris baru.

### Catatan

- Kalau kamu edit Apps Script setelah deploy, biasanya perlu `Deploy -> Manage deployments -> Edit` lalu update deployment.
- Kalau submit gagal, pastikan URL yang dipakai adalah URL `Web app`, bukan URL editor Apps Script.
