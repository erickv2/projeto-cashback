const path = require('path');
const idu = 2;
const { Usuarios } = require('../database/models')
const { Compras } = require('../database/models')

const PagesController = {
    showIndex: async (req, res) => {
        return res.render('index');
    },
    showCadastro: (req, res) => {
        return res.render('cadastro');
    },
    showAdm: async (req, res) => {

        const usuario = await Usuarios.findOne({ where: { id: '18' } })

        return res.render('adm', { usuario })
    },
    showFinalizado: async (req, res) => {
        return res.render('finalizado')
    },
    showAcumular: async (req, res) => {
        return res.render('acumular');
    },
    ShowResgatar: async (req, res) => {
        return res.render('resgatar');
    },
    showConsultar: async (req, res) => {
        return res.render('consultar');
    },
    storeAcumular: async (req, res) => {

        let porcentagem = 5 / 100

        let valorCompra = req.body.valorCompra

        let valorCashback = valorCompra * porcentagem

        let totalCashback = await Cashback.sum('cashback_compra', {
            where: {
                usuario_id: usuario.id
            }
        })

        await Cashback.create({
            cashback_compra: valorCashback,
            cashback_total: totalCashback
            
        })

        let usuario;

        try {
            usuario = await Usuarios.create({
                telefone: req.body.telefone
            })

        } catch (error) { // ver sobre tipo de erro específico para usuário já cadastrado
            usuario = await Usuarios.findOne({
                where: { telefone: req.body.telefone }
            })
        }

        let compra = await Compras.create({
            valor: req.body.valorCompra,
            usuarios_id: usuario.id
        })

        res.redirect('/')
    },
    storeForm: async (req, res) => {

        let data = req.body.dataNascimento;
        let partesData = data.split('/');
        let dataFormatada = partesData[2] + '-' + partesData[1] + '-' + partesData[0];

        let telefone = req.body.telefone;
        let telefoneFormatado = telefone.replace(new RegExp('[^0-9]', 'g'), '');

        let cpf = req.body.cpf;
        let cpfFormatado = cpf.replace(new RegExp('[^0-9]', 'g'), '');


        await Usuarios.create({
            nome: req.body.nome,
            data_nascimento: dataFormatada,
            telefone: telefoneFormatado,
            cpf: cpfFormatado,
            sexo: req.body.sexo,
            email: req.body.email,
            avaliacao_loja: req.body.rating
        })


        res.redirect('finalizado')
    }
}

module.exports = PagesController