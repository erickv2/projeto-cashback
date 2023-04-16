const Usuarios = require('./Usuarios')

module.exports = (sequelize, DataTypes) => {
    const Compras = sequelize.define('Compras', {
        valor: DataTypes.DECIMAL(9,2),
        usuarios_id: DataTypes.INTEGER,
        cashback_compra: DataTypes.DECIMAL(9,2),
        valor_resgate: DataTypes.DECIMAL(9,2),
        updatedAt: DataTypes.DATE
    }, {
        tableName: 'compras'
    }) 

    Compras.associate = models => {
        Compras.belongsTo(models.Usuarios, {
            foreignKey: 'usuarios_id',
            as: 'usuario'
        })
    }

    return Compras
}