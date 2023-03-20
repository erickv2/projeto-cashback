const path = require('path');
const idu = 2;
const { Usuarios } = require('../database/models')
const { Compras } = require('../database/models')

const PagesController = {
    showIndex: async (req, res)=>{
        return res.render('index');
    },
    showCadastro: (req, res)=>{
        return res.render('cadastro');
    },
    showAdm: async (req, res) => {

        const usuario = await Usuarios.findOne({where: {id: '18'}})

        return res.render('adm', {usuario})
    },
    store: async (req, res)=>{

    await Usuarios.create({
            telefone: req.body.telefone
        })

    await Compras.create({
            valor: req.body.valorCompra
        })

        res.redirect('/') 
    }
}

module.exports = PagesController