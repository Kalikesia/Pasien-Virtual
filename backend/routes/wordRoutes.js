const express = require('express')

const {
    compareWord, registerMaster, findBestMatch
} = require('../controllers/wordControllers')

const router = express.Router()

router.route('/compare').post(compareWord)
router.route('/register').post(registerMaster)
router.route('/match').post(findBestMatch)

module.exports = router