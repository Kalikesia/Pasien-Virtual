# Pasien-Virtual
Pasien Virtual SMART-PASIVIK adalah Aplikasi rekomendasi pembelajaran otomatis untuk meningkatkan kompetesi tenaga perawat.

## Algoritma Pasien Virtual
Algoritma Pasien Virtual SMART-PASIVIK umumnya menggunakan Sørensen–Dice's Coefficient dan Naive Bayes. 

Sørensen–Dice coefficient adalah statistik yang digunakan untuk mengukur kesamaan dua sampel, dalam aplikasi ini digunakan untuk mencari kata kunci yang terdapat pada pesan yang dikirim dengan mencocokkan kata yang dimasukkan dengan kata kunci yang terdapat di database.

Naive Bayes Classification adalah pengklasifikasian probabilistik sederhana berdasarkan penerapan teorema Bayes dengan asumsi kuat antara figur, dalam aplikasi ini digunakan untuk mencocokkan kalimat dengan kelompok pertanyaan perawat yang ditanyakan.

Terdapat 6 algoritma yang dapat digunakan pada API Pasien Virtual SMART-PASIVIK, yakni 
1. findWordByKeyword, digunakan untuk mencari kata master paling cocok dengan kalimat yang dikirim menggunakan algoritma Keyword Matching lalu Dice's Coefficient
2. findBestMatch, digunakan untuk kata master yang paling cocok dengan kata yang dimasukkan menggunakan algoritma Dice's Coefficient lalu Keyword Matching
3. naiveBayes, digunakan untuk mengecek kesamaan kata menggunakan Naive Bayes.
4. compareAllAlgorithm, digunakan untuk mengecek kesamaan kata menggunakan semua algoritma di Pasien Virtual SMART-PASIVIK, yakni Dice's Coefficient dan Naive Bayes.
5. sorencentNaiveBayes, digunakan untuk mengecek kesamaan kata menggunakan gabungan Keyword Matching, Dice's Coefficient, dan Naive Bayes (Algoritma Utama!)
6. compareWord, digunakan untuk mencari kata kunci yang berada didatabase dengan skor kesamaan.

Terdapat 4 fungsi yang digunakan untuk CRUD pada database, yakni
1. registerMaster, digunakan untuk memasukkan kata master baru
2. displayDatabase, digunakan untuk mengambil database yang aktif
3. deleteMaster, digunakan untuk digunakan untuk menghapus kata master tertentu yang terdapat di database
4. updateMaster, digunakan untuk digunakan untuk memperbarui kata master tertentu yang terdapat di database


## Flowchart
Flowchart yang terdapat di Pasien Virtual SMART-PASIVIK adalah sebagai berikut

### 1. compareWord
Pseudocode Fungsi compareWord
```
ALGORITMA Mencari nilai kecocokan dua kata dengan fungsi String Similarity
DEKLARASI:
	master, keyword, child = string
	processedMasterText, processedChildText, processedKeyword, keywordChecker = string
	similarityScore = float
	
DESKRIPSI:
	Read(master, keyword, child)
	processedMasterText <- textProcessing(master)
	processedChildText <- textProcessing(child)
	processedKeyword <- textProcessing(keyword)
	
	keywordChecker <- keywordMatching(processedKeyword, processedChildText)
	
	If (master and keyword and child) Then
		similarityScore <- CompareTwoString(processedMasterText, processedChildText)
		
		Write(similarityScore, keywordChecker)
    	Else
        	Write("Please Fill All the Form!")
    	Endif
```

### 2. registerMaster
Pseudocode Fungsi registerMaster
```
ALGORITMA Menambahkan kata kunci ke database
DEKLARASI:
	category, master, varians, keyword, position = string
	cleanedWords, processedWord = list(string)
	processedMaster = string
	word, raw = Word
	
DESKRIPSI:
	Read(category, master, varians, keyword, position)
	For variasi in varians
		cleanedWords.push(textProcessing(variasi))
	Endfor
	
	processedWord <- cleanedWords
    	processedMaster <- textProcessing(master)

    	If length(processedWord) < 10
		Repeat
			processedWord.push(null)
		Until length(processedWord) == 10
	Endif
	
	word = Word(category, processedMaster, processedWord, keyword, position)
	raw = Word(category, master, varians, keyword, position)
	
	If (word != null)
		Write(word)
	Else
		Write("Please Fill All The Form!")
	Endif
```

### 3. findWordByKeyword
Pseudocode Fungsi findWordByKeyword
```
ALGORITMA Mencari kata berdasarkan kata kunci
DEKLARASI:
	child, childSynonym, processedChild, bestMatch, findCategory = string
	wordMaster, masterArray, categoricalArray = list(string)
	countingArray, indexofBiggestElement = list(integer)
	biggestIndex = integer
	keywordArray = list(string)
	keywordChecker, keywordChecker = string
	result = boolean
	
DESKRIPSI:
	childSynonym = replaceSynonym(child)
	processedChild = textProcessing(childSynonym)

    	If isi child kosong {
        	Write("Form is not populated!")
		RETURN Error()
    	Endif

    	wordMaster = Word.find()
    	For word in WordMaster 
		masterArray.push(word["master"])
        	categoricalArray.push(word["keyword"])
        	For variasi in word["varians"]
            		masterArray.push(variasi)
        	Endfor
    	Endfor
	
	For kategori in categoricalArray
		countingArray.push(keywordCounting(textProcessing(kategori), processedChild))
    	Endfor

	biggestIndex = Math.max(...countingArray)
	If (biggestIndex == 0)
        	Write("No word found!")
        	Return Next()
    	Endif
	
    	For hitung in countingArray
		If hitung === biggestIndex
            		indexofBiggestElement.push(hitung);
        	Endif
    	Endfor
    
    	For index in indexofBiggestElement
        	For j = indexofBiggestElement[i] * 11 to indexofBiggestElement[i] * 11 + 11
            		If (masterArray[j] != "")
                		keywordArray.push(masterArray[j])
            		Endif
        	Endfor
    	Endfor
	bestMatch = stringSimilarity.findBestMatch(processedChild, keywordArray)
    	findCategory = Word.findOne(varians, bestMatch["bestMatch"]["target"])
    	If (findCategory == null)
        	findCategory = await Word.findOne(master, bestMatch["bestMatch"]["target"])
    	Endfor
    	keywordChecker = keywordMatching(textProcessing(findCategory["keyword"]), textProcessing(replaceSynonym(bestMatch["bestMatch"]["target"])))
    	keyword = keywordChecker
    	result = false
    	If bestMatch["bestMatch"]["rating"]*100 > 70
        	result = true
    	Endif
    	If bestMatch ditemukan
        	Write(`Kalimat paling sesuai adalah '${bestMatch["bestMatch"]["target"]}' dengan master '${findCategory["master"]}' yang terletak pada Kategori: '${findCategory["category"]}' dengan akurasi sebesar ${Math.round(bestMatch["bestMatch"]["rating"]*100)}% pada posisi ${findCategory["position"]}`, findCategory["keyword"], keyword, result)
    	Else
        	Write("Something gone horribly wrong!")
        	RETURN Error("Something gone horribly wrong!")
    	Endif
```

### 4. findBestMatch
	ALGORITMA Mencari kata yang paling cocok
	DEKLARASI:
		child, processedChildText = string
		databaseArray, masterArray = list(string)
		keywordChecker, keyword = string
		findCategory = Word
		result = boolean
		bestMatch = float
		
	DESKRIPSI:
		Read(child)
		processedChildText = textProcessing(child)

		databaseArray = getDatabaseArray()
		masterArray = databaseArray["masterArray"]

		If child is not null
			bestMatch = stringSimilarity.findBestMatch(processedChildText.join(" "), masterArray)
			findCategory = Word.findOne("varians", bestMatch["bestMatch"]["target"])
			If findCategory is null
				findCategory = Word.findOne("master", bestMatch["bestMatch"]["target"])
			Endif
			keywordChecker = keywordMatching(textProcessing(findCategory["keyword"]), textProcessing(bestMatch["bestMatch"]["target"]))
			keyword = keywordChecker
			result = false
			If (((Math.round(bestMatch["bestMatch"]["rating"]*100)) < 70 || keyword === true) && (Math.round(bestMatch["bestMatch"]["rating"]*100)) > 50)
				result = true
			Else If ((Math.round(bestMatch["bestMatch"]["rating"]*100)) >= 70)
				result = true
			Endif
			Write(`Kalimat paling sesuai adalah '${bestMatch["bestMatch"]["target"]}' dengan master '${findCategory["master"]}' yang terletak pada Kategori: '${findCategory["category"]}' dengan akurasi sebesar ${Math.round(bestMatch["bestMatch"]["rating"]*100)}% pada posisi ${findCategory["position"]}`, findCategory["keyword"], keyword, result)
		Else
			Write("Please Fill All the Form!")
		Endif

### 5. displayDatabase
Pseudocode Fungsi displayDatabase
```
ALGORITMA Menambahkan kata kunci ke database
DEKLARASI:
	data = Word
	
DESKRIPSI:
	data = Word.find()
	
	Write(data)
```

### 6. deleteMaster
Pseudocode Fungsi deleteMaster
```
ALGORITMA Menambahkan kata kunci ke database
DEKLARASI:
	id: integer
	deleteID: Word
	
DESKRIPSI:
	Read(id)
    	If id ditemukan
        	deleteID = Word.findById(id)
        	If deleteID ditemukan
            		remove(deleteID)
            		Write(`Master with id: ${id} Has Been Removed!`)
        	Else
            		Write("Something Went Very Wrong!")
        	Endif
    	Else
        	Write("Parameter is Needed for This Command!")
    	Endif
```

### 7. updateMaster
Pseudocode Fungsi updateMaster
```
ALGORITMA Menambahkan kata kunci ke database
DEKLARASI:
	id = integer
	keyword = string
	updateID = Word

DESKRIPSI:
	Read(id, keyword)

    	If id and keyword ditemukan
        	updateID = Word.findById(id)
        	If updateID ditemukan
            		updateID.keyword = keyword
            		save(updateID)
            		Write(`Master ID: ${id} Has Been Updated With '${keyword}' as the New Keyword`)
        	Else
        	    	Write("Something Went Very Wrong!")
        	Endif
    	Else
        Write(`Please Fill All the Form!`)
    	Endif
```

### 8. naiveBayes
Pseudocode Fungsi naiveBayes
```
ALGORITMA Mencari kalimat yang paling cocok dengan algoritma NaiveBayes
DEKLARASI:
	child, childProcessed, prediction = string
	findCategory = Word
	
DESKRIPSI:
	Read(child)
	childProcessed = textProcessing(replaceSynonym(child))
	prediction = nbc.predict(childProcessed)
	findCategory = Word.findOne("master", prediction)
	Write(`Kalimat master paling sesuai adalah '${prediction}' yang terletak pada Kategori: '${findCategory["category"]}' pada posisi ${findCategory["position"]}`, findCategory["keyword"])
```

### 9. compareAllAlgorithm
Pseudocode Fungsi compareAllAlgorithm
```
ALGORITMA Membandingkan kalimat dengan algoritma yang tersedia (naiveBayes, diceCoefficientResult, dan legacyDiceCoefficientResult)
DEKLARASI:
	child, processedChildText = string
	naiveBayes, diceCoefficientResult, legacyDiceCoefficientResult = int
	
DESKRIPSI:
	Read(child)
	processedChildText = textProcessing(child)
	naiveBayes = axios.post(`https://virtual.pasivik.kalikesia.id/api/algorithm/naiveBayes`, processedChildText)
    	diceCoefficientResult = axios.post(`https://virtual.pasivik.kalikesia.id/api/algorithm/sorencent`, processedChildText)
    	legacyDiceCoefficientResult = axios.post(`https://virtual.pasivik.kalikesia.id/api/algorithm/legacySorencent`, processedChildText)
    	Write(naiveBayes.data["message"], diceCoefficientResult.data["message"], legacyDiceCoefficientResult.data["message"])
```

### 10. sorencentNaiveBayes
Pseudocode Fungsi sorencentNaiveBayes
```
ALGORITMA Mencari kalimat yang paling cocok dengan algoritma sorencentNaiveBayes
DEKLARASI:
	child, childSynonym, processedChild = string
	databaseArray, masterArray, categoricalArray, keywordArray = list(string)
	
DESKRIPSI:
	Read(child)
	childSynonym = replaceSynonym(child)
	processedChild = textProcessing(childSynonym)

    	If child is empty Or child is space
		Return Error("Form is not populated!")
	Endif

    	databaseArray = getDatabaseArray()
    	masterArray = databaseArray["masterArray"]
    	categoricalArray = databaseArray["categoricalArray"]

    	keywordArray = getBiggestElement(masterArray, categoricalArray, processedChild)
    	If keywordArray is "No Word Found!"
        	Write("No Word Found!")
    	Endif
```

# API Pasien Virtual
API Pasien Virtual Pasifik ada 10, yakni `compareWord`, `registerMaster`, `findWordByKeyword`, `findBestMatch`, `displayDatabase`, `deleteMaster`, `updateMaster`, `naiveBayes`, `compareAllAlgorithm`, dan `sorencentNaiveBayes`

## 1. compareWord
compareWord digunakan untuk membandingkan kata master dengan kata yang dikirim

Dapat diakses dengan link `https://virtual.pasivik.kalikesia.id/api/word/compare`
### Cara Penggunaan API
Penggunaan API dapat dilakukan dengan melakukan POST JSON dengan format seperti dibawah
```
{
  "master":"master", 
  "keyword":"keyword",
  "child":"child"
}
```
API akan memberi JSON dengan format dibawah ini
```
{
  "similarityScore":"Skor kemiripan kalimat", 
  "keywordChecker":"kata yang ditemukan"
}
```

## 2. registerMaster
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

## 3. findWordByKeyword
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

## 4. findBestMatch
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
 
## 5. displayDatabase
displayDatabase digunakan untuk mengambil database yang aktif

Dapat diakses dengan link `https://virtual.pasivik.kalikesia.id/api/word/displayDB`
### Cara Penggunaan API
Penggunaan API dapat dilakukan dengan melakukan GET JSON

API akan memberi JSON yang berisi database

## 6. deleteMaster
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

## 7. updateMaster
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
 
## 8. naiveBayes
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

## 9. compareAllAlgorithm
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

## 10. sorencentNaiveBayes
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
