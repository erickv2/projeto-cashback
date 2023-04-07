async function carregarClientes(pagina, quantidade) {
    let response = await fetch(`/api/v1/clientes?pagina=${pagina}&quantidade=${quantidade}`)
    let resultado = await response.json()

    console.log(resultado)
}

async function showUsuarios(usuarios) {
    
}

carregarClientes(1, 5)