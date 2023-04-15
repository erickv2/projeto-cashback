async function carregarClientes() {
    let response = await fetch(`/api/v1/clientes`)
    let resultado = await response.json()

    showUsuarios(resultado)
}

async function showUsuarios(usuarios) {

    let string = ''

    usuarios.forEach(user => {
        string += `<tr>
        <td class="text-center">
        ${user.nome}
        </td>
        <td class="text-center">
        ${user.telefone}
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
        <td class="text-center">
          ${user.saldo_cashback}
        </td>
        <td class="text-center">
          ${user.total_cashback}
        </td>
        <td class="text-center">
        ${user.cashback_resgatado}
        </td>
      </tr>`
    })
    document.getElementsByTagName('tbody')[0].innerHTML = string
}

carregarClientes(3, 5)