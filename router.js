const express = require('express');
const PagesController = require('./controllers/PagesController');

const router = express.Router()

router.get('/', PagesController.showIndex)

router.get('/cadastro', PagesController.showCadastro)

router.get('/adm', PagesController.showAdm)

router.post('/created', PagesController.storeIndex)

module.exports = router