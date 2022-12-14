const mongoose = require('mongoose')

const wordSchema = mongoose.Schema({
    category:{
        type: String,
        required: true
    },
    master:{
        type: String,
        required: true,
    },
    varians:{
        type: Array,
        required: true
    },
    keyword: {
        type: String,
        default: "",
        required: false
    },
    position: {
        type: Number,
        required: true
    }
})

const Word = mongoose.model('Word' , wordSchema)

module.exports = Word