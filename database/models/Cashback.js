module.exports = (sequelize, DataType) => {
    const Cashback = sequelize.define('Cashback', {
        valor_cashback: DataType.DECIMAL(5,2),
        resgatado: DataType.TINYINT
    })

    Cashback.associate = models => {
        Cashback.belongsTo(models.Compras, {
            foreignKey: 'compras_id',
            as: 'compra'
        })
    }
    
        return Cashback
}