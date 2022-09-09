const express = require('express')

const {
    compareWord
} = require('../controllers/wordControllers')

const router = express.Router()

router.route('/compare').post(compareWord)

module.exports = router