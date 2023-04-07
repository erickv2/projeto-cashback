const express = require('express');
const ApiClientesController = require('./controllers/ApiClientesController');

const routerApi = express.Router()

routerApi.get('/clientes', ApiClientesController)

module.exports = routerApi