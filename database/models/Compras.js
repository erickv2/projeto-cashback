const Usuarios = require('./Usuarios')

module.exports = (sequelize, DataTypes) => {
    const Compras = sequelize.define('Compras', {
        data_hora: DataTypes.DATE,
        valor: DataTypes.DECIMAL(5,2),
        usuarios_id: DataTypes.INTEGER
    }, {
        tableName: 'compras'
    }) 

    Compras.associate = models => {
        Compras.belongsTo(models.Usuarios, {
            foreignKey: 'usuarios_id',
            as: 'usuario'
        }),
        Compras.hasOne(models.Cashback, {
            foreignKey: 'compras_id',
            as: 'cashback'
        })
    }

    return Compras
}