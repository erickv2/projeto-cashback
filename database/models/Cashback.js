const Usuarios = require('./Usuarios')
const Lojas = require('./Lojas')

module.exports = (sequelize, DataTypes) => {
    const Cashback = sequelize.define('Cashback', {
        lojas_id: DataTypes.INTEGER,
        usuarios_id: DataTypes.INTEGER,
        saldo_cashback: DataTypes.DECIMAL(9, 2),
        total_cashback: DataTypes.DECIMAL(9, 2),
        cashback_resgatado: DataTypes.DECIMAL(9, 2),
        total_gasto: DataTypes.DECIMAL(9, 2),
        numero_de_compras: DataTypes.INTEGER,
        gasto_medio: DataTypes.DECIMAL(9, 2),
        updatedAt: DataTypes.DATE
    }, {
        tableName: 'cashback',
        timestamps: true
    })

    Cashback.associate = models => {
        Cashback.belongsTo(models.Lojas, {
            foreignKey: 'lojas_id',
            as: 'loja'
        })

        Cashback.belongsTo(models.Usuarios, {
            foreignKey: 'usuarios_id',
            as: 'usuario'
        })
    }

    return Cashback
}
