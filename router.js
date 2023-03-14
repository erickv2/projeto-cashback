const express = require('express');
const PagesController = require('./controllers/PagesController');

const router = express.Router()

router.get('/', PagesController.showIndex)

module.exports = router