const express = require('express')

const {
    registerMaster, displayDatabase, deleteMaster, updateMaster
} = require('../controllers/wordControllers')

const router = express.Router()

router.route('/register').post(registerMaster)
router.route('/displayDB').get(displayDatabase)
router.route('/delete/:id').delete(deleteMaster)
router.route('/update/:id').put(updateMaster)

module.exports = router