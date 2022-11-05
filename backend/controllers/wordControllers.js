const asyncHandler = require('express-async-handler')
const axios = require('axios')
const sastrawi = require("sastrawijs"); 
const stringSimilarity = require("string-similarity")
const { removeStopwords } = require('stopword')
const { ind } = require('../utils/dictionary')
const { synonyms } = require('../utils/synonym')
const Word = require('../models/wordModel');
const Raw = require('../models/rawModel')
const { text } = require('express');
var Classifier = require('wink-naive-bayes-text-classifier')
var nbc = Classifier()

const naiveBayerInit = asyncHandler(async (req, res) => {
    const wordMaster = await Word.find()
    const prepText = function ( text ) {
        let tokenizer = new sastrawi.Tokenizer()
    
        let words = tokenizer.tokenize(text)
        return words
    }
    nbc.definePrepTasks( [ prepText ] );
    nbc.defineConfig( { considerOnlyPresence: true, smoothingFactor: 0.5 } )
    console.log("Naive Bayer Model is Initializing!")
    for(let i = 0; i < wordMaster.length; i++){
        nbc.learn(`${wordMaster[i]["master"]}`, `${wordMaster[i]["master"]}`)
        for(let j = 0; j < wordMaster[i]["varians"].length; j++){
            nbc.learn(`${wordMaster[i]["varians"][j]}`, `${wordMaster[i]["master"]}`)
        }
    }
    nbc.consolidate()
    console.log("Naive Bayer Model is Done Learning!")
})

naiveBayerInit()

const naiveBayer = asyncHandler(async (req, res) => {
    const { child } = req.body
    const childProcessed = textProcessing(replaceSynonym(child))
    prediction = nbc.predict(childProcessed.join(" "))
    findCategory = await Word.findOne({
        master: prediction
    })
    let keywordChecker = keywordMatching(textProcessing(findCategory["keyword"]), textProcessing(prediction))
    let keyword = keywordChecker
    res.status(200).json({
        message: `Kalimat master paling sesuai adalah '${prediction}' yang terletak pada Kategori: '${findCategory["category"]}' pada posisi ${findCategory["position"]}`,
        keyword: findCategory["keyword"],
        keywordBoolean: keyword,
    })
})

function textProcessing(text){
    let stemmed = []
    let stemmer = new sastrawi.Stemmer()
    let tokenizer = new sastrawi.Tokenizer()

    words = tokenizer.tokenize(text)

    for(let i = 0; i < words.length; i++){
        stemmed.push(stemmer.stem(words[i]))
    }

    let cleanedWords = removeStopwords(stemmed, ind)
    let processedWords = [...new Set(cleanedWords)]

    return processedWords
}

function replaceSynonym(sentence){
    let newSentence = sentence

    Object.keys(synonyms).forEach(key => {
        const checkSynonyms = new RegExp(synonyms[key].join('|'),'gi')
        newSentence = newSentence.replace(checkSynonyms, key)
    })

    return newSentence
}

function keywordMatching(keyword, child){
    let checker = 0

    for(let i = 0; i < keyword.length; i++){
        for(let j = 0; j < child.length; j++){
            if(keyword[i] === child[i]){
                checker++
            }
        }
    }
    console.log(checker)
    let combinedWord = textProcessing(replaceSynonym(child.join(" ")))
    console.log(combinedWord)
    if(checker >= Math.round(keyword.length*2/3)){
        return true
    } else {
        checker = 0
        for(let i = 0; i < keyword.length; i++){
            for(let j = 0; j < combinedWord.length; j++){
                if(keyword[i] === combinedWord[i]){
                    checker++
                }
            }
        }
        if(checker >= Math.round(keyword.length*2/3)){
            return true
        } else{
            return false
        }
    }
}

function keywordCounting(keyword, child){
    let checker = 0

    for(let i = 0; i < keyword.length; i++){
        for(let j = 0; j < child.length; j++){
            if(keyword[i] === child[j]){
                checker++
            }
        }
    }
    return checker
}

const findWordByKeyword = asyncHandler(async (req, res, next) => {
    const { child } = req.body
    childSynonym = replaceSynonym(child)
    let processedChild = textProcessing(childSynonym)

    if(child == "" || child == " "){
        throw new Error("Form is not populated!")
    }

    const wordMaster = await Word.find()
    let masterArray = []
    let categoricalArray = []
    for(let i = 0; i < wordMaster.length; i++){
        masterArray.push(wordMaster[i]["master"])
        categoricalArray.push(wordMaster[i]["keyword"])
        for(let j = 0; j < wordMaster[i]["varians"].length; j++){
            masterArray.push(wordMaster[i]["varians"][j])
        }
    }

    //console.log(categoricalArray)

    let countingArray = []

    for(let i = 0; i < categoricalArray.length; i++){
        countingArray.push(keywordCounting(textProcessing(categoricalArray[i]),processedChild))
    }

    //console.log(countingArray)

    const biggestIndex = Math.max(...countingArray)
    if(biggestIndex == 0){
        res.status(200).json({message: "No word found!"})
        return next()
    }


    const indexofBiggestElement = []

    for (let i = 0; i < countingArray.length; i++) {
        if (countingArray[i] === biggestIndex) {
            indexofBiggestElement.push(i);
        }
    }
    //console.log(`keyword in array ${countingArray}`)
    let keywordArray = []

    for(let i = 0; i < indexofBiggestElement.length; i++){
        //console.log(wordMaster[indexofBiggestElement[i] - 1])
        //try for * (10 + 1) or (*10)
        for(let j = indexofBiggestElement[i] * 11; j < indexofBiggestElement[i] * 11 + 11; j++){
            if(masterArray[j] != ""){
                keywordArray.push(masterArray[j])
            }
        }
    }
    const bestMatch = stringSimilarity.findBestMatch(processedChild.join(" "), keywordArray)
    let findCategory = await Word.findOne({
        varians: bestMatch["bestMatch"]["target"]
    })
    if(findCategory === null){
        findCategory = await Word.findOne({
            master: bestMatch["bestMatch"]["target"]
        })
    }
    let keywordChecker = keywordMatching(textProcessing(findCategory["keyword"]), textProcessing(replaceSynonym(bestMatch["bestMatch"]["target"])))
    let keyword = keywordChecker
    let result = false
    if(bestMatch["bestMatch"]["rating"]*100 > 70){
        result = true
    }
    if(bestMatch){
        res.status(201).json({
            message: `Kalimat paling sesuai adalah '${bestMatch["bestMatch"]["target"]}' dengan master '${findCategory["master"]}' yang terletak pada Kategori: '${findCategory["category"]}' dengan akurasi sebesar ${Math.round(bestMatch["bestMatch"]["rating"]*100)}% pada posisi ${findCategory["position"]}`,
            keyword: findCategory["keyword"],
            keywordBoolean: keyword,
            result: result
        })
    } else{
        res.status(400).json({
            message: "Something gone horribly wrong!"
        })
        throw new Error("Something gone horribly wrong!")
    }
    //console.log(bestMatch)
})

const compareWord = asyncHandler(async (req, res) => {
    const { master, keyword, child } = req.body
    let processedMasterText = textProcessing(master)
    let processedChildText = textProcessing(child)
    let processedKeyword = textProcessing(keyword)

    let keywordChecker = keywordMatching(processedKeyword, processedChildText)

    if(master && keyword && child){
        const similarityScore = stringSimilarity.compareTwoStrings(processedMasterText.join(" "), processedChildText.join(" "))

        res.status(201).json({
            similarityScore: similarityScore,
            keywordChecker: keywordChecker
        })
    } else{
        res.status(400).json({
            message: "Please Fill All the Form!"
        })
    }
})

const displayDatabase = asyncHandler(async (req, res) => {
    const data = await Word.find()

    res.status(200).json({
        data
    })
})

const findBestMatch = asyncHandler(async (req, res) => {
    const { child } = req.body
    let processedChildText = textProcessing(child)

    const wordMaster = await Word.find()
    let masterArray = []
    for(let i = 0; i < wordMaster.length; i++){
        masterArray.push(wordMaster[i]["master"])
        for(let j = 0; j < wordMaster[i]["varians"].length; j++){
            masterArray.push(wordMaster[i]["varians"][j])
        }
    }

    if(child){
        const bestMatch = stringSimilarity.findBestMatch(processedChildText.join(" "), masterArray)
        let findCategory = await Word.findOne({
            varians: bestMatch["bestMatch"]["target"]
        })
        if(findCategory === null){
            findCategory = await Word.findOne({
                master: bestMatch["bestMatch"]["target"]
            })
        }
        let keywordChecker = keywordMatching(textProcessing(findCategory["keyword"]), textProcessing(bestMatch["bestMatch"]["target"]))
        let keyword = keywordChecker
        let result = false
        if(((Math.round(bestMatch["bestMatch"]["rating"]*100)) < 70 || keyword === true) && (Math.round(bestMatch["bestMatch"]["rating"]*100)) > 50){
            result = true
        } else if((Math.round(bestMatch["bestMatch"]["rating"]*100)) >= 70){
            result = true
        }
        res.status(201).json({
            message: `Kalimat paling sesuai adalah '${bestMatch["bestMatch"]["target"]}' dengan master '${findCategory["master"]}' yang terletak pada Kategori: '${findCategory["category"]}' dengan akurasi sebesar ${Math.round(bestMatch["bestMatch"]["rating"]*100)}% pada posisi ${findCategory["position"]}`,
            keyword: findCategory["keyword"],
            keywordBoolean: keyword,
            result: result
        })
        //console.log(bestMatch["bestMatch"])
        //console.log(findCategory["category"])
    } else{
        res.status(400).json({
            message: "Please Fill All the Form!"
        })
    }
})

const registerMaster = asyncHandler(async (req, res) => {
    const {
        category,
        master,
        varians,
        keyword,
        position
    } = req.body

    cleanedWords = []
    for(let i = 0; i < varians.length; i++){
        cleanedWords.push(textProcessing(varians[i]).join(" "))
    }

    let processedWord = [...new Set(cleanedWords)]
    let processedMaster = textProcessing(master).join(" ")

    if(processedWord.length < 10){
        for(let i = processedWord.length; i < 10; i++){
            processedWord.push(null)
        }
    }

    const word = await Word.create({
        category,
        master: processedMaster,
        varians: processedWord,
        keyword,
        position
    })
    const raw = await Raw.create({
        category,
        master: master,
        varians: varians,
        keyword,
        position
    })
    if(word){
        res.status(201).json({
            word
        })
    } else{
        res.status(400).json({
            message: "Please Fill All The Form!"
        })
    }
})

const deleteMaster = asyncHandler(async (req, res) => {
    const id = req.params.id
    if(id){
        const deleteID = await Word.findById(id)
        if(deleteID){
            await deleteID.remove()
            res.status(200).json({
                message: `Master with id: ${id} Has Been Removed!`
            })
        } else{
            res.status(200).json({
                message: "Something Went Very Wrong!"
            })
        }
    } else{
        res.status(404).json({
            message: "Parameter is Needed for This Command!"
        })
    }
})

const updateMaster = asyncHandler(async (req, res) => {
    const id = req.params.id
    const {
        keyword
    } = req.body

    if(id && keyword){
        const updateID = await Word.findById(id)
        if(updateID){
            updateID.keyword = keyword
            await updateID.save()
            res.status(200).json({
                message: `Master ID: ${id} Has Been Updated With '${keyword}' as the New Keyword`
            })
        } else{
            res.status(200).json({
                message: "Something Went Very Wrong!"
            })
        }
    } else {
        res.status(404).json({
            message: `Please Fill All the Form!`
        })
    }
})

const compareAllAlgorithm = asyncHandler(async (req, res) => {
    const { child } = req.body
    let processedChildText = textProcessing(child)
    const naiveBayer = await axios.post(`https://smart-pasivik-wma.herokuapp.com/api/word/naiveBayer`, {
        child: processedChildText.join(" ")
    })
    const diceCoefficientResult = await axios.post(`https://smart-pasivik-wma.herokuapp.com/api/word/match`, {
        child: processedChildText.join(" ")
    })
    const legacyDiceCoefficientResult = await axios.post(`https://smart-pasivik-wma.herokuapp.com/api/word/legacyMatch`, {
        child: processedChildText.join(" ")
    })
    res.status(200).json({
        naiveBayer: naiveBayer.data["message"],
        diceCoefficient: diceCoefficientResult.data["message"],
        legacyDiceCoefficient: legacyDiceCoefficientResult.data["message"]
    })
})

module.exports = {
    compareWord,
    registerMaster,
    findBestMatch,
    displayDatabase,
    deleteMaster,
    updateMaster,
    findWordByKeyword,
    naiveBayer,
    naiveBayerInit,
    compareAllAlgorithm
}
