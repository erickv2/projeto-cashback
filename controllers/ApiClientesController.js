const path = require('path');
const { Usuarios } = require('../database/models')

const ApiClientesController = async (req, res) => {
    let usuarios = await Usuarios.findAll()

    res.status(200).json(usuarios)
}

module.exports = ApiClientesController