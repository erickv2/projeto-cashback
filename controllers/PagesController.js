const path = require('path');
const idu = 2;
const { Usuarios } = require('../database/models')

const PagesController = {
    showIndex: (req, res)=>{
        return res.render('index');
    },
    store: async (req, res)=>{

        let usuario = {
            telefone: req.body.telefone
        }
        
        await Usuarios.create(usuario)

        res.redirect('/') 
    }
}

module.exports = PagesController