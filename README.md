# Pasien-Virtual
Pasien Virtual SMART-PASIVIK adalah

## Algoritma Pasien Virtual
Algoritma Pasien Virtual SMART-PASIVIK umumnya menggunakan Sørensen–Dice's Coefficient dan Naive Bayes. 

Sørensen–Dice coefficient adalah statistik yang digunakan untuk mengukur kesamaan dua sampel[1], dalam aplikasi ini digunakan untuk mencari kata kunci yang terdapat pada pesan yang dikirim dengan mencocokkan kata yang dimasukkan dengan kata kunci yang terdapat di database.

Naive Bayes Classification adalah pengklasifikasian probabilistik sederhana berdasarkan penerapan teorema Bayes dengan asumsi kuat antara figur[2], dalam aplikasi ini digunakan untuk mencocokkan kalimat dengan kelompok pertanyaan perawat yang ditanyakan.

Terdapat 5 algoritma yang dapat digunakan pada API Pasien Virtual SMART-PASIVIK, yakni 
1. findWordByKeyword, digunakan untuk mencari kata master paling cocok dengan kalimat yang dikirim menggunakan algoritma Keyword Matching lalu Dice's Coefficient
2. findBestMatch, digunakan untuk kata master yang paling cocok dengan kata yang dimasukkan menggunakan algoritma Dice's Coefficient lalu Keyword Matching
3. naiveBayes, digunakan untuk mengecek kesamaan kata menggunakan Naive Bayes.
4. compareAllAlgorithm, digunakan untuk mengecek kesamaan kata menggunakan semua algoritma di Pasien Virtual SMART-PASIVIK, yakni Dice's Coefficient dan Naive Bayes.
5. sorencentNaiveBayes, digunakan digunakan untuk mengecek kesamaan kata menggunakan gabungan Keyword Matching, Dice's Coefficient, dan Naive Bayes (Algoritma Utama!)

Terdapat 4 fungsi yang digunakan untuk CRUD pada database, yakni
1. registerMaster, digunakan untuk memasukkan kata master baru
2. displayDatabase, digunakan untuk mengambil database yang aktif
3. deleteMaster, digunakan untuk digunakan untuk menghapus kata master tertentu yang terdapat di database
4. updateMaster, digunakan untuk digunakan untuk memperbarui kata master tertentu yang terdapat di database


## Flowchart
Flowchart yang terdapat di Pasien Virtual SMART-PASIVIK adalah sebagai berikut

### 1. registerMaster
Flowchart 1

### 2. findWordByKeyword
Flowchart 2

### 3. findBestMatch
Flowchart 3

### 4. displayDatabase
Flowchart 4

### 5. deleteMaster
Flowchart 5

### 6. updateMaster
Flowchart 6

### 7. naiveBayes
Flowchart 7

### 8. compareAllAlgorithm
Flowchart 8

### 9. sorencentNaiveBayes
Flowchart 9

# API Pasien Virtual
API Pasien Virtual Pasifik ada 9, yakni `registerMaster`, `findWordByKeyword`, `findBestMatch`, `displayDatabase`, `deleteMaster`, `updateMaster`, `naiveBayes`, `compareAllAlgorithm`, dan `sorencentNaiveBayes`

## 1. registerMaster
registerMaster digunakan untuk memasukkan kata master baru 

Dapat diakses dengan link `https://virtual.pasivik.kalikesia.id/api/word/register`
### Cara Penggunaan API
Penggunaan API dapat dilakukan dengan melakukan POST JSON dengan format seperti dibawah
```
{
  "category":"kategori",
  "master":"master",
  "varians":"variasi",
  "keyword":"kata kunci",
  "position":"posisi"
}
```
API akan memberi JSON dengan format dibawah ini
```
{
  "category":"kategori yang sudah diolah",
  "master":"master yang sudah diolah",
  "varians":"variasi yang sudah diolah",
  "keyword":"kata kunci yang sudah diolah",
  "position":"posisi yang sudah diolah"
}
```

## 2. findWordByKeyword
findWordByKeyword digunakan untuk mencari kata master paling cocok dengan kalimat yang dikirim

Dapat diakses dengan link `https://virtual.pasivik.kalikesia.id/api/algorithm/sorencent`
### Cara Penggunaan API
Penggunaan API dapat dilakukan dengan melakukan POST JSON dengan format seperti dibawah
```
{
  "child":"kalimat"
}
```
API akan memberi JSON dengan format dibawah ini
```
{
  "message": "Kalimat Terbaik Menggunakan Keyword Matching + Dice Coefficient dan Posisinya",
  "keyword": "Keyword dari Kalimat Terdeteksi Menurut Algoritma",
  "keywordBoolean": "Kebenaran Kata Kunci",
  "result": "Kebenaran dari Input User"
}
```

## 3. findBestMatch
findBestMatch digunakan untuk mencari kata master paling cocok dengan kalimat yang dikirim

Dapat diakses dengan link `https://virtual.pasivik.kalikesia.id/api/algorithm/legacySorencent`
### Cara Penggunaan API
Penggunaan API dapat dilakukan dengan melakukan POST JSON dengan format seperti dibawah
```
{
  "child":"kalimat"
}
```
API akan memberi JSON dengan format dibawah ini
```
{
  "message": "Kalimat Terbaik Menggunakan Dice Coefficient + Keyword Matching dan Posisinya",
  "keyword": "Keyword dari Kalimat Terdeteksi Menurut Algoritma",
  "keywordBoolean": "Kebenaran Kata Kunci",
  "result": "Kebenaran dari Input User"
}
```
 
## 4. displayDatabase
displayDatabase digunakan untuk mengambil database yang aktif

Dapat diakses dengan link `https://virtual.pasivik.kalikesia.id/api/word/displayDB`
### Cara Penggunaan API
Penggunaan API dapat dilakukan dengan melakukan GET JSON

API akan memberi JSON yang berisi database

## 5. deleteMaster
deleteMaster digunakan untuk digunakan untuk menghapus kata master tertentu yang terdapat di database

Dapat diakses dengan link `https://virtual.pasivik.kalikesia.id/api/word/delete/:id` dengan :id adalah nomor id kata master yang ingin dihapus

### Cara Penggunaan API
Penggunaan API dapat dilakukan dengan melakukan DELETE JSON

API akan memberi JSON dengan format dibawah ini
```
{
  "message":"pesan konfirmasi bahwa kata sudah dihapus"
}
```

## 6. updateMaster
updateMaster digunakan untuk digunakan untuk memperbarui kata master tertentu yang terdapat di database

Dapat diakses dengan link `https://virtual.pasivik.kalikesia.id/api/word/update/:id` dengan :id adalah nomor id kata master yang ingin diperbarui

### Cara Penggunaan API
Penggunaan API dapat dilakukan dengan melakukan PUT JSON dengan format seperti dibawah
```
{
  "keyword":"kata kunci yang ingin di perbarui"
}
```
API akan memberi JSON dengan format dibawah ini
```
{
  "message":"pesan konfirmasi bahwa kata kunci sudah diperbarui"
}
```
 
## 7. naiveBayes
naiveBayes digunakan untuk mengecek kesamaan kata menggunakan Naive Bayes.

Dapat diakses dengan link `https://virtual.pasivik.kalikesia.id/api/algorithm/naiveBayes`

### Cara Penggunaan API
Penggunaan API dapat dilakukan dengan melakukan POST JSON dengan format seperti dibawah
```
{
  "child":"kalimat"
}
```
API akan memberi JSON dengan format dibawah ini
```
{
  "message": "Kalimat Terbaik Menggunakan Naive Bayes dan Posisinya",
  "keyword": "Keyword dari Kalimat Terdeteksi Menurut Algoritma"
}
```

## 8. compareAllAlgorithm
compareAllAlgorithm digunakan untuk mengecek kesamaan kata menggunakan semua algoritma di Pasien Virtual SMART-PASIVIK, yakni Dice's Coefficient dan Naive Bayes

Dapat diakses dengan link `https://virtual.pasivik.kalikesia.id/api/algorithm/compareAll`

### Cara Penggunaan API
Penggunaan API dapat dilakukan dengan melakukan POST JSON dengan format seperti dibawah
```
{
  "child":"kalimat"
}
```
API akan memberi JSON dengan format dibawah ini
```
{
  "naiveBayes":"hasil menggunakan Naive Bayes",
  "diceCoefficient":"hasil menggunakan Dice's Coefficient",
  "legacyDiceCoefficient":"hasil menggunakan variasi Dice's Coefficient",
}
```

## 9. sorencentNaiveBayes
sorencentNaiveBayes digunakan untuk mengecek kesamaan kata menggunakan algoritma gabungan di Pasien Virtual SMART-PASIVIK, yakni Keyword Matching, Dice's Coefficient dan Naive Bayes

Dapat diakses dengan link `https://virtual.pasivik.kalikesia.id/algorithm/match`

### Cara Penggunaan API
Penggunaan API dapat dilakukan dengan melakukan POST JSON dengan format seperti dibawah
```
{
  "child": "kalimat"
}
```
API akan memberi JSON dengan format dibawah ini
```
{
  "message": "Kalimat Terbaik Menurut Algoritma dan Posisinya",
  "keyword": "Keyword dari Kalimat Terdeteksi Menurut Algoritma"
}
```

# Isu
Isu yang ada
- (belum ada)


# Referensi
1. 
