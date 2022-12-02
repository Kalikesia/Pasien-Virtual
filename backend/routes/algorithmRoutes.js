const express = require('express')

const {
    findBestMatch, findWordByKeyword, naiveBayes, compareAllAlgorithm, sorencentNaiveBayes
} = require('../controllers/algorithmControllers')

const router = express.Router()

router.route('/sorencent').post(findWordByKeyword)
router.route('/legacySorencent').post(findBestMatch)
router.route('/naiveBayes').post(naiveBayes)
router.route('/compareAll').post(compareAllAlgorithm)
router.route('/match').post(sorencentNaiveBayes)

module.exports = router