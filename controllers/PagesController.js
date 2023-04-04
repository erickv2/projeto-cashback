const path = require('path');
const idu = 2;
const { Usuarios } = require('../database/models')
const { Compras } = require('../database/models')
const { Lojas } = require('../database/models');
const { DECIMAL } = require('sequelize');

//define a porcentagem de cashback que vai ser usada
async function buscaPorcento() {

    //busca a loja
    let loja = await Lojas.findOne({
        where: {
            id: 1
        }
    })

    //define porcentagem
    const porcentagem = loja.cashback_percent

    //retorna porcentagem
    return porcentagem
}

async function buscarUsuario(telefone, criar) {

    // se criar = true, encontra ou cria o usuario
    if (criar === true) {
        await Usuarios.findOrCreate({ where: { telefone: telefone } })
        const usuario = await Usuarios.findAll({ where: { telefone: telefone }, raw: true }).then(result => result[0])
        return usuario
    }

    // se criar === false, só encontra o usuario
    else {

        const usuario = await Usuarios.findAll({ where: { telefone: telefone }, raw: true }).then(result => result[0])
        console.log(usuario)
        if (usuario !== undefined) { return usuario }
        else {
            console.log('usuário não encontrado')
            return null
        }

    }

}
async function atualizarCompras(usuario, valorCompra) {

    //incrementa o total de compras do usuário
    let numeroDeCompras = usuario.numero_de_compras + 1
    let totalGasto = usuario.total_gasto
    let valorCashback

    // debug
    console.log('valor compra:', valorCompra)

    //testa se o valor de compra é negativo e define o cashback e o valor da compra pra 0
    if (valorCompra < 0) {
        valorCashback = valorCompra
        valorCompra = 0
    }

    else {
        //incrementa o total gasto
        console.log('total gasto anterior: ', totalGasto)
        totalGasto = totalGasto + valorCompra
        console.log('total gasto atual: ', totalGasto)

        //Calcula o cashback
        valorCashback = valorCompra * porcentagem
    }

    //Cacula a média de gasto
    let mediaDeGasto = totalGasto / numeroDeCompras;


    let id = usuario.id

    //debug
    console.log('id: ', id)
    console.log('numeroDeCompras: ', numeroDeCompras)
    console.log('totalGasto: ', totalGasto)
    console.log('mediaDeGasto: ', mediaDeGasto)

    //testa se a mediaDeGasto foi calculada corretamente e se a id foi estabelecida corretamente
    if (mediaDeGasto !== undefined && id !== undefined) {

        //atualiza a media de gasto, total gasto e numero de compras na tabela usuario
        await Usuarios.update({
            gasto_medio: mediaDeGasto,
            total_gasto: totalGasto,
            numero_de_compras: numeroDeCompras
        },
            { where: { id: id } });

        //atualiza a tabela compras
        await Compras.create({
            valor: valorCompra,
            cashback_compra: valorCashback,
            usuarios_id: id
        });

        console.log('Compra atualizada')
    }
    else {
        console.log('Erro na atualização da compra.')
    }


    // atualiza a tabela de compras com valor e cashback da compra


    return valorCashback

}

const PagesController = {
    showIndex: async (req, res) => {

        //checa conexão com banco de dados
        try {
            porcentagem = await buscaPorcento()
            console.log(porcentagem)
            return res.render('index');

        } catch (error) {
            return res.redirect('erro')
        }

    },
    showErro: async (req, res) => {

        return res.render('erro')

    },
    showCadastro: async (req, res) => {
        let erro;
        return res.render('cadastro', { erro });
    },
    showAdm: async (req, res) => {

        const usuarios = await Usuarios.findAll()

        return res.render('adm', { usuarios })
    },
    showFinalizado: async (req, res) => {
        return res.render('finalizado')
    },
    showAcumular: async (req, res) => {
        return res.render('acumular');
    },
    ShowResgatar: async (req, res) => {
        let erro;
        let valor;
        return res.render('resgatar', { erro, valor });
    },
    showConsultar: async (req, res) => {
        let usuario;
        let erro;
        return res.render('consultar', { erro, usuario });
    },
    storeAcumular: async (req, res) => {

        //resgata porcentagem
        porcentagem = await buscaPorcento()


        //pega os valores e trata
        const valorCompra = parseFloat(req.body.valorCompra.replace(',', '.'))

        const telefone = req.body.telefone.replace(new RegExp('[^0-9]', 'g'), '');

        const usuario = await buscarUsuario(telefone, true);

        if (usuario !== undefined) {
            console.log(usuario);

            // console.log('valorCashback:', valorCashback);
            console.log('Cashback Atual:', await usuario.saldo_cashback, usuario.total_cashback);
            const valorCashback = await atualizarCompras(await usuario, valorCompra);

            //incrementa o saldo de cashback e total de cashback
            await Usuarios.increment(['saldo_cashback', 'total_cashback'], { by: valorCashback, where: { id: usuario.id } });
        } else {
            console.log('Usuário não encontrado');
        }

        res.redirect('/')

    },
    storeResgatar: async (req, res) => {

        //resgata porcentagem
        porcentagem = await buscaPorcento()

        //copiar para storeAcumular
        // tratando os dados inseridos
        let valorCompra = req.body.valorCompra;
        valorCompra = valorCompra.replace(',', '.');


        let telefone = req.body.telefone;
        telefone = telefone.replace(new RegExp('[^0-9]', 'g'), '');

        let valor;
        let erro;

        const usuario = await buscarUsuario(telefone, false)
        


        if (usuario == null) {
            erro = ("Este usuário não existe")
            res.render('resgatar', { erro })
        }

        //se já cadastrou
        else if (usuario.cpf == null) {
            erro = ("Este usuário não completou o cadastro")
            res.render('resgatar', { erro })
        }
        else {

            let cashbackAtual = usuario.saldo_cashback

            //calcula a diferença entre o valor da compra e o saldo de cashback
            let valorCompraResgatada = valorCompra - cashbackAtual

            //debug
            console.log(cashbackAtual)
            console.log(valorCompraResgatada)
            // checa se o valor da compra resgatada é negativo

            if (valorCompraResgatada < 0) {

                //calcula o que sobra do valor de cashback
                cashbackAtual = valorCompraResgatada * -1
                await atualizarCompras(await usuario, valorCompraResgatada);

                //atualiza o saldo de cashback para a sobra
                await Usuarios.update({ saldo_cashback: cashbackAtual }, { where: { id: usuario.id } });

                //transforma cashbackAtual em uma string formatada
                cashbackAtual = cashbackAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                valor = `A cobrar: R$0,00 \n\nCashback atual: ${cashbackAtual}`
            }

            else {
                cashbackAtual = 0

                await atualizarCompras(await usuario, valorCompraResgatada);
                //zera o saldo de cashback
                await Usuarios.update({ saldo_cashback: cashbackAtual }, { where: { id: usuario.id } });

                valorCompraResgatada = valorCompraResgatada.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                cashbackAtual = cashbackAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                

                valor = `A cobrar: ${valorCompraResgatada} \n\nCashback atual: ${cashbackAtual}`

            }

            res.render('resgatar', { erro, valor })
        }
    },
    storeConsultar: async (req, res) => {

        //pega o telefone e trata o dado
        let telefone = req.body.telefone;
        telefone = telefone.replace(new RegExp('[^0-9]', 'g'), '');
        usuario = await buscarUsuario(telefone)
        let erro = ""
        if (usuario == null) {
            erro = ("Este usuário não existe")
            res.render('consultar', { erro })
        }
        else {
            res.render('consultar', { erro, usuario: usuario });
        }
    },
    storeForm: async (req, res) => {

        //tratando dados
        let data = req.body.dataNascimento;
        let partesData = data.split('/');
        let dataFormatada = partesData[2] + '-' + partesData[1] + '-' + partesData[0];

        const telefone = req.body.telefone.replace(new RegExp('[^0-9]', 'g'), '');

        let cpf = req.body.cpf.replace(new RegExp('[^0-9]', 'g'), '');

        //encontra usuário
        const usuario = await buscarUsuario(telefone)

        console.log(cpf)
        console.log(usuario)

        //se o usuário não existe
        if (usuario == null) {
            erro = ("Este telefone não é o mesmo que foi cadastrado na loja")
            res.render('cadastro', { erro })
        }
        //se já cadastrou
        else if (usuario.cpf !== null) {
            erro = ("Já existe um usuário cadastrado com este CPF")
            res.render('cadastro', { erro })
        }
        else {
            await Usuarios.update({
                nome: req.body.nome,
                data_nascimento: dataFormatada,
                telefone: telefone,
                cpf: cpf,
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
}

module.exports = PagesController