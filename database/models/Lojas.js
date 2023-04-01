module.exports = (sequelize, DataTypes) => {
    const Lojas = sequelize.define('Lojas', {
        nome_loja: DataTypes.STRING(100),
        cashback_percent: DataTypes.DECIMAL(9,2)

    })
        return Lojas
}