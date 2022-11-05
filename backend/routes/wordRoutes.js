const express = require('express')

const {
    compareWord, registerMaster, findBestMatch, displayDatabase, deleteMaster, updateMaster, findWordByKeyword, naiveBayer, naiveBayerInit, compareAllAlgorithm
} = require('../controllers/wordControllers')

const router = express.Router()

router.route('/compare').post(compareWord)
router.route('/register').post(registerMaster)
router.route('/match').post(findWordByKeyword)
router.route('/legacyMatch').post(findBestMatch)
router.route('/displayDB').get(displayDatabase)
router.route('/delete/:id').delete(deleteMaster)
router.route('/update/:id').put(updateMaster)
router.route('/naiveBayer').post(naiveBayer)
router.route('/compareAll').post(compareAllAlgorithm)

module.exports = router