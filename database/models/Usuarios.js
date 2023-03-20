const Compras = require('./Compras')

module.exports = (sequelize, DataTypes) => {
    const Usuarios = sequelize.define('Usuarios', {
        nome: {
            type:DataTypes.STRING(100),
            allowNull: true
        },
        data_nascimento: DataTypes.DATE,
        telefone: DataTypes.INTEGER,
        cpf: DataTypes.INTEGER,
        sexo: DataTypes.INTEGER,
        email: DataTypes.STRING(45),
        avaliacao_loja: DataTypes.INTEGER
    }, {
        tableName: 'usuarios'
    })

    Usuarios.associate = models => {
        Usuarios.hasMany(models.Compras, {
            foreignKey: 'usuarios_id',
            as: 'usuarios'
        })
    }

        return Usuarios
}

