const path = require('path');
const idu = 2;
const { Usuarios } = require('../database/models')
const { Compras } = require('../database/models')

let porcentagem = 5 / 100

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


        let valorCompra = req.body.valorCompra

        valorCompra = valorCompra.replace(',', '.');

        let valorCashback = valorCompra * porcentagem

        let usuario;

        let telefone = req.body.telefone;
        telefone = telefone.replace(new RegExp('[^0-9]', 'g'), '');

        //TODO: IMPLEMENTAR NA FUNÇÃO DE RESGATE E DE CONSULTA
        try {
            usuario = await Usuarios.create({
                telefone: telefone
            })

        } catch (error) { //TODO: ver sobre tipo de erro específico para usuário já cadastrado
            usuario = await Usuarios.findOne({
                where: { telefone: telefone }
            })
        }


        let compra = await Compras.create({
            valor: valorCompra,
            cashback_compra: valorCashback,
            usuarios_id: usuario.id
        })



        let incrementarTotalDeCompras = await Usuarios.increment('numero_de_compras', { where: { id: usuario.id }, returning: true });

        let numeroDeCompras = await Usuarios.findOne({
            where: {
                id: usuario.id
            },
            attributes: ['numero_de_compras'],
            raw: true
        });

        numeroDeCompras = numeroDeCompras.numero_de_compras;

        let incrementarTotalGasto = await Usuarios.increment('total_gasto', { by: valorCompra, where: { id: usuario.id }, returning: true });

        let totalGasto = await Usuarios.findOne({
            where: {
                id: usuario.id
            },
            attributes: ['total_gasto'],
            raw: true
        });

        totalGasto = totalGasto.total_gasto;


        let mediaDeGasto = totalGasto / numeroDeCompras

        let incrementarTotalCashback = await Usuarios.increment('total_cashback', { by: valorCashback, where: { id: usuario.id }, returning: true });

        let totalCashback = await Usuarios.findOne({
            where: {
                id: usuario.id
            },
            attributes: ['total_cashback'],
            raw: true
        });


        totalCashback = totalCashback.total_cashback;
        let cashbackAtual = await Usuarios.findOne({
            where: {
                id: usuario.id
            },
            attributes: ['saldo_cashback'],
            raw: true
        });

        cashbackAtual = cashbackAtual.saldo_cashback;

        //testa se o cashback atual é zero
        if (cashbackAtual == 0) {
            await Usuarios.update({
                total_cashback: totalCashback,
                saldo_cashback: valorCashback,
                numero_de_compras: numeroDeCompras,
                gasto_medio: mediaDeGasto
            }, {
                where: {
                    id: usuario.id
                }
            })

        } else {
            //incrementa o saldo de cashback
            await Usuarios.increment('saldo_cashback', { by: valorCashback, where: { id: usuario.id }, returning: true });

            await Usuarios.update({
                total_gasto: totalGasto,
                numero_de_compras: numeroDeCompras,
                gasto_medio: mediaDeGasto
            }, {
                where: {
                    id: usuario.id
                }
            })
        }
        console.log(totalCashback)
        console.log(usuario.total_cashback)
        console.log(valorCashback)

        res.redirect('/')
    },
    storeResgatar: async (req, res) => {
        //copiar para storeAcumular
        // tratando os dados inseridos
        let valorCompra = req.body.valorCompra;
        valorCompra = valorCompra.replace(',', '.');


        let telefone = req.body.telefone;
        telefone = telefone.replace(new RegExp('[^0-9]', 'g'), '');

        let usuario = await Usuarios.findOne({
            where: { telefone: telefone }
        })

        let cashbackAtual = await Usuarios.findOne({
            where: {
                id: usuario.id
            },
            attributes: ['saldo_cashback'],
            raw: true
        });

        cashbackAtual = cashbackAtual.saldo_cashback;

        //calcula a diferença entre o valor da compra e o saldo de cashback
        let valorCompraResgatada = valorCompra - cashbackAtual;

        console.log(cashbackAtual)
        console.log(valorCompraResgatada)

        // checa se o valor da compra resgatada é negativo
        if (valorCompraResgatada < 0) {
            cashbackAtual = valorCompraResgatada * -1
        }
        else {
            cashbackAtual = 0
        }

        let incrementarTotalDeCompras = await Usuarios.increment('numero_de_compras', { where: { id: usuario.id }, returning: true });

        //incrementa média de gasto
        let numeroDeCompras = await Usuarios.findOne({
            where: {
                id: usuario.id
            },
            attributes: ['numero_de_compras'],
            raw: true
        });

        numeroDeCompras = numeroDeCompras.numero_de_compras

        let totalGasto = await Usuarios.findOne({
            where: {
                id: usuario.id
            },
            attributes: ['total_gasto'],
            raw: true
        });

        totalGasto = totalGasto.total_gasto

        let mediaDeGasto = totalGasto / numeroDeCompras

        //incrementa total gasto
        await Usuarios.increment('total_gasto', { by: valorCompra, where: { id: usuario.id }, returning: true });

        await Usuarios.update({
            saldo_cashback: cashbackAtual,
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