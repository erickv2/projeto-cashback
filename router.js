const express = require('express');
const PagesController = require('./controllers/PagesController');

const router = express.Router()

router.get('/', PagesController.showIndex)

router.get('/cadastro', PagesController.showCadastro)

router.get('/adm', PagesController.showAdm)

router.get('/finalizado', PagesController.showFinalizado)

router.get('/acumular', PagesController.showAcumular)

router.get('/resgatar', PagesController.ShowResgatar)

router.get('/consultar', PagesController.showConsultar)


// -----------------------------------------------------------

<<<<<<< HEAD
router.post('/store-acumular', PagesController.storeAcumular)
=======
// router.post('/created', PagesController.storeIndex)
>>>>>>> 46a5f616081d7caff2bbbc6b63cc6770df255ea9

router.post('/createdForm', PagesController.storeForm)

module.exports = router