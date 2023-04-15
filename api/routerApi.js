const express = require('express');
const ApiClientesController = require('../api/api-clientes');

const routerApi = express.Router()

routerApi.get('/clientes', ApiClientesController)

module.exports = routerApi