const asyncHandler = require('express-async-handler') //For future development if API is needed!
const sastrawi = require("sastrawijs"); 
const stringSimilarity = require("string-similarity")
const { removeStopwords, ind } = require('stopword')
const Word = require('../models/wordModel')

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

function keywordMatching(keyword, child){
    let checker = 0

    for(let i = 0; i < keyword.length; i++){
        for(let j = 0; j < child.length; j++){
            if(keyword[i] === child[i]){
                checker++
            }
        }
    }
    if(checker >= Math.round(keyword.length*2/3)){
        return true
    } else {
        return false
    }
}

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
    const { keyword, child } = req.body
    //let processedMasterText = textProcessing(master)
    let processedChildText = textProcessing(child)
    let processedKeyword = textProcessing(keyword)

    //let keywordChecker = keywordMatching(processedKeyword, processedChildText)

    const wordMaster = await Word.find()
    let masterArray = []
    for(let i = 0; i < wordMaster.length; i++){
        masterArray.push(wordMaster[i]["master"])
        for(let j = 0; j < wordMaster[i]["varians"].length; j++){
            masterArray.push(wordMaster[i]["varians"][j])
        }
    }

    console.log(masterArray)

    if(keyword && child){
        const bestMatch = stringSimilarity.findBestMatch(processedChildText.join(" "), masterArray)
        let findCategory = await Word.findOne({
            varians: bestMatch["bestMatch"]["target"]
        })
        if(findCategory === null){
            findCategory = await Word.findOne({
                master: bestMatch["bestMatch"]["target"]
            })
        }
        res.status(201).json({
            message: `Kalimat paling sesuai adalah '${bestMatch["bestMatch"]["target"]}' yang terletak pada Kategori: '${findCategory["category"]}' dengan akurasi sebesar ${Math.round(bestMatch["bestMatch"]["rating"]*100)}% pada posisi ${findCategory["position"]}`
        })
        console.log(bestMatch["bestMatch"])
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

    const word = await Word.create({
        category,
        master: processedMaster,
        varians: processedWord,
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

module.exports = {
    compareWord,
    registerMaster,
    findBestMatch,
    displayDatabase,
    deleteMaster,
    updateMaster
}
