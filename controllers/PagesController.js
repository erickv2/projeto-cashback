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

        valorCompra = valorCompra.replace(',', '.');

        let valorCashback = valorCompra * porcentagem

        let usuario;

        let telefone = req.body.telefone;
        let telefoneFormatado = telefone.replace(new RegExp('[^0-9]', 'g'), '');

        try {
            usuario = await Usuarios.create({
                telefone: telefoneFormatado
            })

        } catch (error) { // ver sobre tipo de erro específico para usuário já cadastrado
            usuario = await Usuarios.findOne({
                where: { telefone: telefoneFormatado }
            })
        }


        let compra = await Compras.create({
            valor: valorCompra,
            cashback_compra: valorCashback,
            usuarios_id: usuario.id
        })
        

        let totalCashback = await Compras.sum('cashback_compra', {
            where: {
                usuarios_id: usuario.id
            }
        })

        // let totalGasto = await Compras.sum('valor', { where: { usuarios_id: usuario.id} });


       let incrementarTotalDeCompras = await Usuarios.increment('numero_de_compras', {where: {id: usuario.id}, returning: true});

       let numeroDeCompras = await Usuarios.findOne({
        where: {
          id: usuario.id
        },
        attributes: ['numero_de_compras'],
        raw: true
      });

        let { numero_de_compras } = numeroDeCompras

        let incrementarTotalGasto = await Usuarios.increment('total_gasto', {by: valorCompra, where: {id: usuario.id}, returning: true});
        
        let totalGasto = await Usuarios.findOne({
            where: {
              id: usuario.id
            },
            attributes: ['total_gasto'],
            raw: true
          });

          let { total_gasto } = totalGasto
          
        let mediaDeGasto = total_gasto / numero_de_compras

        await Usuarios.update({
            saldo_cashback: totalCashback,
            total_cashback: totalCashback,
            total_gasto: total_gasto, // ver o que não está funcionando no total
            numero_de_compras: numero_de_compras,
            gasto_medio: mediaDeGasto
        }, {
            where: {
                id: usuario.id
            }
        })

        res.redirect('/')
    },
    storeResgatar: async (req, res) => {
        let valorCompra = req.body.valorCompra;
        valorCompra = valorCompra.replace(',', '.');

        let telefone = req.body.telefone;
        let telefoneFormatado = telefone.replace(new RegExp('[^0-9]', 'g'), '');

        let usuario = await Usuarios.findOne({
            where: { telefone: telefoneFormatado }
        })
        
        let totalCashback = await Compras.sum('cashback_compra', {
            where: {
                usuarios_id: usuario.id
            }
        })

        if(totalCashback >= valorCompra){
         let novoValorCashback = totalCashback - valorCompra

         await Usuarios.update({
            saldo_cashback: novoValorCashback,
            total_cashback: totalCashback
        }, {
            where: {
                id: usuario.id
            }
        })

         console.log(novoValorCashback)    

        }else{
         let novoValorCompra = valorCompra - totalCashback
         CashbackZerado = 0

         await Usuarios.update({
            saldo_cashback: CashbackZerado,
            total_cashback: totalCashback
        }, {
            where: {
                id: usuario.id
            }
        })

         console.log(novoValorCompra)
         console.log(totalCashback)
        }

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

        let usuario = await Usuarios.findOne({
            where: { telefone: telefoneFormatado }
        })

        await Usuarios.update({
            nome: req.body.nome,
            data_nascimento: dataFormatada,
            telefone: telefoneFormatado,
            cpf: cpfFormatado,
            sexo: req.body.sexo,
            email: req.body.email,
            avaliacao_loja: req.body.rating
        }, {
            where: {
                id: usuario.id
            }
        })


        res.redirect('finalizado')
    }
}

module.exports = PagesController