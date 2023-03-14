module.exports = (sequelize, DataType) => {
    const Usuarios = sequelize.define('Usuarios', {
        nome: {
            type:DataType.STRING(100),
            allowNull: true
        },
        data_nascimento: DataType.DATE,
        telefone: DataType.INTEGER,
        cpf: DataType.INTEGER,
        sexo: DataType.INTEGER,
        email: DataType.STRING(45),
        avaliacao_loja: DataType.INTEGER
    }, {
        tableName: 'usuarios'
    })

        return Usuarios
}

