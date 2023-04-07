const path = require('path');
const { Usuarios } = require('../database/models')

const ApiClientesController = async (req, res) => {
    let pagina = Number(req.query.pagina)
    let qtd = Number(req.query.quantidade)
    console.log(pagina)
    console.log(qtd)
    let usuarios = await Usuarios.findAll({ limit: qtd}, {offset: (pagina -1) * qtd })

    res.status(200).json(usuarios)
}

const listaClientes = async (req, res) => {
    let string = ''
    let usuarios = await Usuarios.findAll({ limit: qtd}, {offset: (pagina -1) * qtd })
    usuarios.forEach(user => {
        string += `<tr>
        <td class="text-center">
          ${user.nome}
        </td>
        <td class="text-center">
          <img src="img/whatsapp.png" alt="" id="whatsapp">
          <img src="img/email.png" alt="" id="email">
        </td>
        <td class="text-center">
        ${user.total_gasto}
        </td>
        <td class="text-center">
          ${user.numero_de_compras}
        </td>
        <td class="text-center">
          ${user.avaliacao_loja}
        </td>
        <td class="text-center">Ultima compra</td>
        <td class="text-center">
          ${user.gasto_medio}
        </td>
        <td class="text-center">Cliente há</td>
        <td class="text-center">
          ${user.saldo_cashback}
        </td>
        <td class="text-center">
          ${user.total_cashback}
        </td>
        <td class="text-center">Créditos resgatados</td>
      </tr>`
    })
    document.getElementsByTagName('tbody')[0].innerHTML = string
}

module.exports = ApiClientesController