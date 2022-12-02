const asyncHandler = require('express-async-handler')
const Word = require('../models/wordModel');
const Raw = require('../models/rawModel')

const displayDatabase = asyncHandler(async (req, res) => {
    const data = await Word.find()

    res.status(200).json({
        data
    })
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
            processedWord.push("")
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

module.exports = {
    registerMaster,
    displayDatabase,
    deleteMaster,
    updateMaster
}
