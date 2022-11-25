# Pasien-Virtual
Pasien Virtual SMART-PASIVIK adalah

## Algoritma Pasien Virtual
Algoritma Pasien Virtual SMART-PASIVIK umumnya menggunakan Sørensen–Dice's Coefficient dan Naive Bayes. 

Sørensen–Dice coefficient adalah statistik yang digunakan untuk mengukur kesamaan dua sampel[1], dalam aplikasi ini digunakan untuk mencari kata kunci yang terdapat pada pesan yang dikirim dengan mencocokkan kata yang dimasukkan dengan kata kunci yang terdapat di database.

Naive Bayes Classification adalah pengklasifikasian probabilistik sederhana berdasarkan penerapan teorema Bayes dengan asumsi kuat antara figur[2], dalam aplikasi ini digunakan untuk mencocokkan kalimat dengan kelompok pertanyaan perawat yang ditanyakan.

Ada 9 Algoritma yang ada di Pasien Virtual SMART-PASIVIK, yakni 
1. compareWord, digunakan untuk mengecek kesamaan kalimat dengan Dice's Coefficient
2. registerMaster, digunakan untuk memasukkan kata master baru
3. findWordByKeyword, digunakan untuk mencari kata master paling cocok dengan kalimat yang dikirim
4. findBestMatch, digunakan untuk kata master yang paling cocok dengan kata yang dimasukkan
5. displayDatabase, digunakan untuk mengambil database yang aktif
6. deleteMaster, digunakan untuk digunakan untuk menghapus kata master tertentu yang terdapat di database
7. updateMaster, digunakan untuk digunakan untuk memperbarui kata master tertentu yang terdapat di database
8. naiveBayes, digunakan untuk mengecek kesamaan kata menggunakan Naive Bayes.
9. compareAllAlgorithm, digunakan untuk mengecek kesamaan kata menggunakan semua algoritma di Pasien Virtual SMART-PASIVIK, yakni Dice's Coefficient dan Naive Bayes.

## Flowchart
Flowchart yang terdapat di Pasien Virtual SMART-PASIVIK adalah sebagai berikut
### 1. compareWord
Flowchart 1

### 2. registerMaster
Flowchart 2

### 3. findWordByKeyword
Flowchart 3

### 4. findBestMatch
Flowchart 4

### 5. displayDatabase
Flowchart 5

### 6. deleteMaster
Flowchart 6

### 7. updateMaster
Flowchart 7

### 8. naiveBayes
Flowchart 8

### 9. compareAllAlgorithm
Flowchart 9

# API Pasien Virtual
API Pasien Virtual Pasifik ada 9, yakni `compareWord`, `registerMaster`, `findWordByKeyword`, `findBestMatch`, `displayDatabase`, `deleteMaster`, `updateMaster`, `naiveBayes`, dan `compareAllAlgorithm`.

## 1. compareWord
compareWord digunakan untuk mengecek kesamaan kalimat dengan Dice's Coefficient. 

Dapat diakses dengan link `https://smart-pasivik-wma.herokuapp.com/api/word/compare`
### Cara Penggunaan API
Penggunaan API dapat dilakukan dengan melakukan POST JSON dengan format seperti dibawah
```
{
  "master": "master adalah"
  "keyword": "keyword adalah"
  ”child”: ”child adalah”
}
```
API akan memberi JSON dengan format dibawah ini
```
{
  "similarityScore": "skor adalah",
  "keywordChecker": "nilai kebenaran adalah"
}
```

## 2. registerMaster
registerMaster digunakan untuk memasukkan kata master baru 

Dapat diakses dengan link `https://smart-pasivik-wma.herokuapp.com/api/word/register`
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

## 3. findWordByKeyword
findWordByKeyword digunakan untuk mencari kata master paling cocok dengan kalimat yang dikirim

Dapat diakses dengan link `https://smart-pasivik-wma.herokuapp.com/api/word/match`
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
  "message":"pesan",
  "keyword":"kata kunci",
  "keywordBoolean":"kebenaran kata kunci",
  "result":"hasil"
}
```

## 4. findBestMatch
findBestMatch digunakan untuk mencari kata master paling cocok dengan kalimat yang dikirim

Dapat diakses dengan link `https://smart-pasivik-wma.herokuapp.com/api/word/legacyMatch`
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
  "message":"pesan",
  "keyword":"kata kunci",
  "keywordBoolean":"kebenaran kata kunci",
  "result":"hasil"
}
```
 
## 5. displayDatabase
displayDatabase digunakan untuk mengambil database yang aktif

Dapat diakses dengan link `https://smart-pasivik-wma.herokuapp.com/api/word/displayDB`
### Cara Penggunaan API
Penggunaan API dapat dilakukan dengan melakukan GET JSON

API akan memberi JSON yang berisi database

## 6. deleteMaster
deleteMaster digunakan untuk digunakan untuk menghapus kata master tertentu yang terdapat di database

Dapat diakses dengan link `https://smart-pasivik-wma.herokuapp.com/api/word/delete/:id` dengan :id adalah nomor id kata master yang ingin dihapus

### Cara Penggunaan API
Penggunaan API dapat dilakukan dengan melakukan DELETE JSON

API akan memberi JSON dengan format dibawah ini
```
{
  "message":"pesan konfirmasi bahwa kata sudah dihapus"
}
```

## 7. updateMaster
updateMaster digunakan untuk digunakan untuk memperbarui kata master tertentu yang terdapat di database

Dapat diakses dengan link `https://smart-pasivik-wma.herokuapp.com/api/word/update/:id` dengan :id adalah nomor id kata master yang ingin diperbarui

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
 
## 8. naiveBayes
naiveBayes digunakan untuk mengecek kesamaan kata menggunakan Naive Bayes.

Dapat diakses dengan link `https://smart-pasivik-wma.herokuapp.com/api/word/naiveBayes`

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
  "message":"pesan",
  "keyword":"kata kunci",
  "keywordBoolean":"kebenaran kata kunci"
}
```

## 9. compareAllAlgorithm
compareAllAlgorithm digunakan untuk mengecek kesamaan kata menggunakan semua algoritma di Pasien Virtual SMART-PASIVIK, yakni Dice's Coefficient dan Naive Bayes

Dapat diakses dengan link `https://smart-pasivik-wma.herokuapp.com/api/word/compareAll`

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

# Isu
Isu yang ada
- (belum ada)


# Referensi
1. 
