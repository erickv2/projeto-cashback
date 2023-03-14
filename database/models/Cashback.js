module.exports = (sequelize, DataType) => {
    const Cashback = sequelize.define('Cashback', {
        valor_cashback: DataType.DECIMAL(5,2),
        resgatado: DataType.TINYINT
    })
        return Cashback
}