const express = require('express')

const {
    compareWord, registerMaster, findBestMatch, displayDatabase, deleteMaster, updateMaster, findWordByKeyword, naiveBayes, compareAllAlgorithm, sorencentNaiveBayes
} = require('../controllers/wordControllers')

const router = express.Router()

//router.route('/compare').post(compareWord)
router.route('/register').post(registerMaster)
router.route('/match').post(findWordByKeyword)
router.route('/legacyMatch').post(findBestMatch)
router.route('/displayDB').get(displayDatabase)
router.route('/delete/:id').delete(deleteMaster)
router.route('/update/:id').put(updateMaster)
router.route('/naiveBayer').post(naiveBayes)
router.route('/compareAll').post(compareAllAlgorithm)
router.route('/algorithm').post(sorencentNaiveBayes)

module.exports = router