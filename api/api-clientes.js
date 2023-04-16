const path = require('path');
const { Usuarios } = require('../database/models')
const { Cashback } = require('../database/models')
const idLoja = 1

const ApiClientesController = async (req, res) => {
    let usuarios = await Usuarios.findAll()
    let cashback = await Cashback.findAll({where: {lojas_id: idLoja}})

    res.status(200).json(usuarios, cashback)
}

module.exports = ApiClientesController