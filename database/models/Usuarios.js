const Compras = require('./Compras')

module.exports = (sequelize, DataTypes) => {
    const Usuarios = sequelize.define('Usuarios', {
        nome: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        data_nascimento: DataTypes.DATE,
        telefone: DataTypes.INTEGER,
        cpf: DataTypes.INTEGER,
        sexo: DataTypes.INTEGER,
        email: DataTypes.STRING(45),
        avaliacao_loja: DataTypes.INTEGER,
        saldo_cashback: DataTypes.DECIMAL(9, 2),
        total_cashback: DataTypes.DECIMAL(9, 2),
        cashback_resgatado: DataTypes.DECIMAL(9, 2),
        total_gasto: DataTypes.DECIMAL(9, 2),
        numero_de_compras: DataTypes.INTEGER,
        gasto_medio: DataTypes.DECIMAL(9, 2)
    }, {
        tableName: 'usuarios',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    })

    Usuarios.associate = models => {
        Usuarios.hasMany(models.Compras, {
            foreignKey: 'usuarios_id',
            as: 'compras'
        })
    }

    return Usuarios
}

