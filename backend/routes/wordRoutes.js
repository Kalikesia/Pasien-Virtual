const express = require('express')

const {
    compareWord, registerMaster, findBestMatch, displayDatabase
} = require('../controllers/wordControllers')

const router = express.Router()

router.route('/compare').post(compareWord)
router.route('/register').post(registerMaster)
router.route('/match').post(findBestMatch)
router.route('/displayDB').get(displayDatabase)

module.exports = router