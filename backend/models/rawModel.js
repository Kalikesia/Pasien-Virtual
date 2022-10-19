const mongoose = require('mongoose')

const rawSchema = mongoose.Schema({
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

const Raw = mongoose.model('Raw' , rawSchema)

module.exports = Raw