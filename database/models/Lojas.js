module.exports = (sequelize, DataType) => {
    const Lojas = sequelize.define('Lojas', {
        nome_loja: DataType.INTEGER
    })
        return Lojas
}