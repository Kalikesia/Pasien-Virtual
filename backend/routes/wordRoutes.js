const express = require('express')

const {
    compareWord, registerMaster, findBestMatch, displayDatabase, deleteMaster, updateMaster
} = require('../controllers/wordControllers')

const router = express.Router()

router.route('/compare').post(compareWord)
router.route('/register').post(registerMaster)
router.route('/match').post(findBestMatch)
router.route('/displayDB').get(displayDatabase)
router.route('/delete/:id').post(deleteMaster)
router.route('/update/:id').put(updateMaster)

module.exports = router