const asyncHandler = require('express-async-handler')
const axios = require('axios')
const sastrawi = require("sastrawijs"); 
const stringSimilarity = require("string-similarity")
const { removeStopwords } = require('stopword')
const { ind } = require('../utils/dictionary')
const { synonyms } = require('../utils/synonym')
const Word = require('../models/wordModel');
const { text } = require('express');
var Classifier = require('wink-naive-bayes-text-classifier')
var nbc = Classifier()

const naiveBayesInit = asyncHandler(async (req, res) => {
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
    if(res){
        res.json({
            message: "Model have been Retrained!"
        })
    }
    
})

naiveBayesInit()

const naiveBayes = asyncHandler(async (req, res) => {
    const { child } = req.body
    const childProcessed = textProcessing(replaceSynonym(child))
    prediction = nbc.predict(childProcessed.join(" "))
    findCategory = await Word.findOne({
        master: prediction
    })
    res.status(200).json({
        message: `Kalimat master paling sesuai adalah '${prediction}' yang terletak pada Kategori: '${findCategory["category"]}' pada posisi ${findCategory["position"]}`,
        keyword: findCategory["keyword"]
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
    let combinedWord = textProcessing(replaceSynonym(child.join(" ")))
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

const getDatabaseArray = asyncHandler(async (idSC, req, res) => {
    let masterArray = []
    let categoricalArray = []
    // const wordMaster = await Word.find()
    const basurl = process.env.BASEURL_API
    const getDataAPI = await axios.get(basurl+"api/study_case/asked/data/"+idSC)
    const wordMaster = getDataAPI.data.data
    for(let i = 0; i < wordMaster.length; i++){
        masterArray.push(wordMaster[i]["master"])
        categoricalArray.push(wordMaster[i]["keyword"])
        for(let j = 0; j < wordMaster[i]["varians"].length; j++){
            masterArray.push(wordMaster[i]["varians"][j])
        }
    }
    
    return { 'masterArray': masterArray, 'categoricalArray': categoricalArray }
})

const getBiggestElement = asyncHandler(async (masterArray, categoricalArray, processedChild, req, res) => {
    let countingArray = []

    for(let i = 0; i < categoricalArray.length; i++){
        countingArray.push(keywordCounting(textProcessing(categoricalArray[i]), processedChild))
    }

    const biggestIndex = Math.max(...countingArray)
    if(biggestIndex == 0){
        return "No Word Found!"
    }

    const indexofBiggestElement = []

    for (let i = 0; i < countingArray.length; i++) {
        if (countingArray[i] === biggestIndex) {
            indexofBiggestElement.push(i);
        }
    }
    let keywordArray = []

    for(let i = 0; i < indexofBiggestElement.length; i++){
        for(let j = indexofBiggestElement[i] * 11; j < indexofBiggestElement[i] * 11 + 11; j++){
            if(masterArray[j] != ""){
                keywordArray.push(masterArray[j])
            }
        }
    }
    return keywordArray
})

const findWordByKeyword = asyncHandler(async (req, res, next) => {
    const { child } = req.body
    childSynonym = replaceSynonym(child)
    let processedChild = textProcessing(childSynonym)

    if(child == "" || child == " "){
        throw new Error("Form is not populated!")
    }

    const databaseArray = await getDatabaseArray()
    const masterArray = databaseArray["masterArray"]
    const categoricalArray = databaseArray["categoricalArray"]

    const keywordArray = await getBiggestElement(masterArray, categoricalArray, processedChild)

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
})

const findBestMatch = asyncHandler(async (req, res) => {
    const { child } = req.body
    let processedChildText = textProcessing(child)

    const databaseArray = await getDatabaseArray(req.body.study_case_id)
    let masterArray = databaseArray["masterArray"]
    
    if(child){
        const bestMatch = stringSimilarity.findBestMatch(processedChildText.join(" "), masterArray)
        const basurl = process.env.BASEURL_API
        const findDataVarians = await axios.post(basurl+"api/study_case/asked/varian/"+req.body.study_case_id, {varian: bestMatch["bestMatch"]["target"]})
        let findCategory = findDataVarians.data.data

        if(findCategory === null){
            const findDataMaster = await axios.post(basurl+"api/study_case/asked/varian/"+req.body.study_case_id+"?type=master", {varian: bestMatch["bestMatch"]["target"]})
            findCategory = findDataMaster.data.data
        }
        let keywordChecker = keywordMatching(textProcessing(findCategory["keyword"]), textProcessing(bestMatch["bestMatch"]["target"]))
        let keyword = keywordChecker
        let result = false
        if(((Math.round(bestMatch["bestMatch"]["rating"]*100)) < 70 || keyword === true) && (Math.round(bestMatch["bestMatch"]["rating"]*100)) > 50){
            result = true
        } else if((Math.round(bestMatch["bestMatch"]["rating"]*100)) >= 70){
            result = true
        }
        // res.status(201).json({
        //     message: `Kalimat paling sesuai adalah '${bestMatch["bestMatch"]["target"]}' dengan master '${findCategory["master"]}' yang terletak pada Kategori: '${findCategory["category"]}' dengan akurasi sebesar ${Math.round(bestMatch["bestMatch"]["rating"]*100)}% pada posisi ${findCategory["position"]}`,
        //     keyword: findCategory["keyword"],
        //     keywordBoolean: keyword,
        //     result: result
        // })
        res.status(201).json({
            category: findCategory["category"],
            master: findCategory["master"],
            answer: findCategory["answer"],
            position: findCategory["position"],
            order_by_user: req.body.order_by_user,
            answer_true_or_false: findCategory["answer_true_or_false"],
            bobot_score: findCategory["score"],
            recommended: findCategory["recommended"],
            id: findCategory["id"],
        })
    } else{
        res.status(400).json({
            message: "Please Fill All the Form!"
        })
    }
})

const compareAllAlgorithm = asyncHandler(async (req, res) => {
    const { child } = req.body
    let processedChildText = textProcessing(child)
    const naiveBayes = await axios.post(`https://virtual.pasivik.kalikesia.id/api/algorithm/naiveBayes`, {
        child: processedChildText.join(" ")
    })
    const diceCoefficientResult = await axios.post(`https://virtual.pasivik.kalikesia.id/api/algorithm/sorencent`, {
        child: processedChildText.join(" ")
    })
    const legacyDiceCoefficientResult = await axios.post(`https://virtual.pasivik.kalikesia.id/api/algorithm/legacySorencent`, {
        child: processedChildText.join(" ")
    })
    res.status(200).json({
        naiveBayes: naiveBayes.data["message"],
        diceCoefficient: diceCoefficientResult.data["message"],
        legacyDiceCoefficient: legacyDiceCoefficientResult.data["message"]
    })
})

const sorencentNaiveBayes = asyncHandler(async (req, res) => {
    const { child } = req.body
    childSynonym = replaceSynonym(child)
    let processedChild = textProcessing(childSynonym)

    if(child == "" || child == " "){
        throw new Error("Form is not populated!")
    }

    const databaseArray = await getDatabaseArray(req.body.study_case_id)
    let masterArray = databaseArray["masterArray"]
    let categoricalArray = databaseArray["categoricalArray"]

    const keywordArray = await getBiggestElement(masterArray, categoricalArray, processedChild)
    if(keywordArray == "No Word Found!"){
        res.status(201).json({
            message: "No Word Found!"
        })
    }

    const bestMatch = stringSimilarity.findBestMatch(processedChild.join(" "), keywordArray)
    let result = false
    if(bestMatch["bestMatch"]["rating"]*100 >= 68){
        result = true
    }
    if(result){
        let findCategory = await Word.findOne({
            varians: bestMatch["bestMatch"]["target"]
        })
        if(findCategory === null){
            findCategory = await Word.findOne({
                master: bestMatch["bestMatch"]["target"]
            })
        }
        res.status(201).json({
            message: `Kalimat paling sesuai adalah '${bestMatch["bestMatch"]["target"]}' dengan master '${findCategory["master"]}' yang terletak pada Kategori: '${findCategory["category"]}' dengan akurasi sebesar ${Math.round(bestMatch["bestMatch"]["rating"]*100)}% pada posisi ${findCategory["position"]}`,
            keyword: findCategory["keyword"],
        })
    } else if(!result){
        prediction = nbc.predict(processedChild.join(" "))
        findCategory = await Word.findOne({
            master: prediction
        })
        res.status(200).json({
            message: `Kalimat master paling sesuai adalah '${prediction}' yang terletak pada Kategori: '${findCategory["category"]}' pada posisi ${findCategory["position"]}`,
            keyword: findCategory["keyword"]
        })
    } else{
        res.status(400).json({
            message: "Something gone horribly wrong!"
        })
        throw new Error("Something gone horribly wrong!")
    }
})

module.exports = {
    naiveBayesInit,
    findBestMatch,
    findWordByKeyword,
    naiveBayes,
    compareAllAlgorithm,
    sorencentNaiveBayes
}
