const path = require('path');
const idu = 2;
const { Usuarios } = require('../database/models')
const { Compras } = require('../database/models')

//define a porcentagem de cashback que vai ser usada
//TODO: buscar porcentagem de cashback da tabela lojista do banco de dados, inserir função na pagina de logista para alterar a porcentagem de cashback
const porcentagem = 5 / 100

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
        if (usuario !== undefined){return usuario}
        else{console.log('usuário não encontrado')}

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

async function pegaValores() {
    //nao funciona, ver como criar esse tipo de função como API pelo POST
    //pega os valores e trata
    let valorCompra = req.body.valorCompra

    valorCompra = valorCompra.replace(',', '.');

    const telefone = req.body.telefone.replace(new RegExp('[^0-9]', 'g'), '');
    // telefone = telefone.replace(new RegExp('[^0-9]', 'g'), '');


}

// async function atualizarCashback(usuario, valorCompra) {
//     //calcula o cashback
//     let valorCashback = valorCompra * porcentagem

//     //incrementa o total de cashback com o valor do cashback atual e retorna o total de cashback
//     const totalCashback = await Usuarios.increment('total_cashback', {
//         by: valorCashback, where: { id: usuario.id }, returning: true
//     }).then(result => result[0][0].total_cashback);


//     const cashbackAtual = await Usuarios.findOne({
//         where: { id: usuario.id },
//         attributes: ['saldo_cashback'],
//         raw: true
//     }).then(result => result.saldo_cashback);

//     if (cashbackAtual == 0) {
//         await Usuarios.update({
//             total_cashback: totalCashback,
//             saldo_cashback: valorCashback,
//             numero_de_compras: numeroDeCompras.numero_de_compras,
//             gasto_medio: mediaDeGasto
//         }, {
//             where: { id: usuario.id }
//         });
//     }
//     else {
//         await Usuarios.increment('saldo_cashback', {
//             by: valorCashback, where: { id: usuario.id }, returning: true
//         });
//         await Usuarios.update({
//             total_gasto: totalGasto,
//             numero_de_compras: numeroDeCompras,
//             gasto_medio: mediaDeGasto
//         }, {
//             where: { id: usuario.id }
//         });
//     }
// }

const PagesController = {
    showIndex: async (req, res) => {
        return res.render('index');
    },
    showCadastro: (req, res) => {
        return res.render('cadastro');
    },
    showAdm: async (req, res) => {

        const usuario = await Usuarios.findOne({ where: { id: '1' } })

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
        let usuario = "";
        return res.render('consultar', {usuario: usuario});
    },
    storeAcumular: async (req, res) => {
        //pega os valores e trata
        const valorCompra = parseFloat(req.body.valorCompra.replace(',', '.'))

        const telefone = req.body.telefone.replace(new RegExp('[^0-9]', 'g'), '');
        // telefone = telefone.replace(new RegExp('[^0-9]', 'g'), '');

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
        // const usuario = await buscarUsuario(await telefone)
        //     console.log('Usuário encontrado: %d', usuario),
        //     console.log('valorCashback:', valorCashback),
        //     console.log('Cashback Atual:', usuario.saldo_cashback, usuario.total_cashback)

        // await atualizarCompras(await usuario, valorCompra).then(
        //     //incrementa o saldo de cashback e total de cashback
        // updateCashback = await Usuarios.increment(['saldo_cashback', 'total_cashback'], { by: valorCashback, where: { id: usuario.id } }),
        // console.log('Cashback Update: %d', updateCashback))

        // let incrementarTotalDeCompras = await Usuarios.increment('numero_de_compras', { where: { id: usuario.id }, returning: true });

        // let numeroDeCompras = await Usuarios.findOne({
        //     where: {
        //         id: usuario.id
        //     },
        //     attributes: ['numero_de_compras'],
        //     raw: true
        // });

        // numeroDeCompras = numeroDeCompras.numero_de_compras;

        // let incrementarTotalGasto = await Usuarios.increment('total_gasto', { by: valorCompra, where: { id: usuario.id }, returning: true });

        // let totalGasto = await Usuarios.findOne({
        //     where: {
        //         id: usuario.id
        //     },
        //     attributes: ['total_gasto'],
        //     raw: true
        // });

        // totalGasto = totalGasto.total_gasto;


        // let mediaDeGasto = totalGasto / numeroDeCompras

        // let incrementarTotalCashback = await Usuarios.increment('total_cashback', { by: valorCashback, where: { id: usuario.id }, returning: true });

        // let totalCashback = await Usuarios.findOne({
        //     where: {
        //         id: usuario.id
        //     },
        //     attributes: ['total_cashback'],
        //     raw: true
        // });


        // totalCashback = totalCashback.total_cashback;
        // let cashbackAtual = await Usuarios.findOne({
        //     where: {
        //         id: usuario.id
        //     },
        //     attributes: ['saldo_cashback'],
        //     raw: true
        // });

        // cashbackAtual = cashbackAtual.saldo_cashback;

        // //testa se o cashback atual é zero
        // if (cashbackAtual == 0) {
        //     await Usuarios.update({
        //         total_cashback: totalCashback,
        //         saldo_cashback: valorCashback,
        //         // numero_de_compras: numeroDeCompras,
        //         // gasto_medio: mediaDeGasto
        //     }, {
        //         where: {
        //             id: usuario.id
        //         }
        //     })

        // } else {
        // //incrementa o saldo de cashback
        // await Usuarios.increment('saldo_cashback', { by: valorCashback, where: { id: usuario.id }, returning: true });

        //     await Usuarios.update({
        //         total_gasto: totalGasto,
        //         numero_de_compras: numeroDeCompras,
        //         gasto_medio: mediaDeGasto
        //     }, {
        //         where: {
        //             id: usuario.id
        //         }
        //     })
        // }
        // console.log(totalCashback)
        // console.log(usuario.total_cashback)
        // console.log(valorCashback)

        res.redirect('/')
    },
    storeResgatar: async (req, res) => {
        //copiar para storeAcumular
        // tratando os dados inseridos
        let valorCompra = req.body.valorCompra;
        valorCompra = valorCompra.replace(',', '.');


        let telefone = req.body.telefone;
        telefone = telefone.replace(new RegExp('[^0-9]', 'g'), '');

        // let usuario = await Usuarios.findOne({
        //     where: { telefone: telefone }
        // })

        // let cashbackAtual = await Usuarios.findOne({
        //     where: {
        //         id: usuario.id
        //     },
        //     attributes: ['saldo_cashback'],
        //     raw: true
        // });


        const usuario = await buscarUsuario(telefone, false)
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
            if (usuario !== undefined) {
                await atualizarCompras(await usuario, valorCompraResgatada);
                //atualiza o saldo de cashback para a sobra
                await Usuarios.update({ saldo_cashback: cashbackAtual},{ where: { id: usuario.id } });
            } else {
                console.log('Usuário não encontrado');
            }
        }
        else {
            cashbackAtual = 0
            if (usuario !== undefined) {
                await atualizarCompras(await usuario, valorCompraResgatada);
                //zera o saldo de cashback
                await Usuarios.update({ saldo_cashback: cashbackAtual},{ where: { id: usuario.id } });
            } else {
                console.log('Usuário não encontrado');
            }
        }

        // let incrementarTotalDeCompras = await Usuarios.increment('numero_de_compras', { where: { id: usuario.id }, returning: true });

        // //incrementa média de gasto
        // let numeroDeCompras = await Usuarios.findOne({
        //     where: {
        //         id: usuario.id
        //     },
        //     attributes: ['numero_de_compras'],
        //     raw: true
        // });

        // numeroDeCompras = numeroDeCompras.numero_de_compras

        // let totalGasto = await Usuarios.findOne({
        //     where: {
        //         id: usuario.id
        //     },
        //     attributes: ['total_gasto'],
        //     raw: true
        // });

        // totalGasto = totalGasto.total_gasto

        // let mediaDeGasto = totalGasto / numeroDeCompras

        // //incrementa total gasto
        // await Usuarios.increment('total_gasto', { by: valorCompra, where: { id: usuario.id }, returning: true });

        // await Usuarios.update({
        //     saldo_cashback: cashbackAtual,
        //     gasto_medio: mediaDeGasto
        // }, {
        //     where: {
        //         id: usuario.id
        //     }
        // })


        res.redirect('/')
    },
    storeConsultar: async (req, res) => {
        //pega o telefone e trata o dado
        let telefone = req.body.telefone;
        telefone = telefone.replace(new RegExp('[^0-9]', 'g'), '');
        usuario = await buscarUsuario(telefone)
        console.log(usuario)
        id = usuario.id
        console.log(id)
        res.render('consultar', {usuario: usuario});
        // res.redirect('/')
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