const { Usuarios } = require('../database/models')

async function teste() {
    let usuario = {
        telefone: 1344444444
    }
    await Usuarios.create(usuario)

    let usuarios = await Usuarios.findAll()
    console.log(usuarios)
}

teste()