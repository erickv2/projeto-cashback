module.exports = (sequelize, DataTypes) => {
    const Cashback = sequelize.define('Cashback', {
        cashback_compra: DataTypes.DECIMAL(5,2),
        cashback_total: DataTypes.DECIMAL(5,2),
        compras_id: DataTypes.INTEGER
    })

    Cashback.associate = models => {
        Cashback.belongsTo(models.Compras, {
            foreignKey: 'compras_id',
            as: 'compra'
        })
    }
    
        return Cashback
}