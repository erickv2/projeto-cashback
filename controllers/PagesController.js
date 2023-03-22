const path = require('path');
const idu = 2;
const { Usuarios } = require('../database/models')
const { Compras } = require('../database/models')
const { Cashback } = require('../database/models')

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
            cashback_compra: valorCashback,
            usuarios_id: usuario.id
        })
        

        let totalCashback = await Compras.sum('cashback_compra', {
            where: {
                usuarios_id: usuario.id
            }
        })

        let totalGasto = await Compras.sum('valor', {
            where: {
                usuarios_id: usuario.id
            }
        })

        let numeroDeCompras = await Compras.count('id', {
            where: {
                usuarios_id: usuario.id
            }
        })


        let mediaDeGasto = totalGasto / numeroDeCompras

        await Usuarios.update({
            saldo_cashback: totalCashback,
            total_gasto: totalGasto, // ver o que não está funcionando no total gasto
            numero_de_compras: numeroDeCompras,
            gasto_medio: mediaDeGasto
        }, {
            where: {
                id: usuario.id
            }
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