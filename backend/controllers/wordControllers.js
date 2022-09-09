const asyncHandler = require('express-async-handler') //For future development if API is needed!
const sastrawi = require("sastrawijs"); 
const stringSimilarity = require("string-similarity")
const { removeStopwords, ind } = require('stopword')

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

module.exports = {
    compareWord
}