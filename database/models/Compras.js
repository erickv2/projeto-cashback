module.exports = (sequelize, DataType) => {
    const Compras = sequelize.define('Compras', {
        data_hora: DataType.DATE,
        valor: DataType.DECIMAL(5,2)
    })
    return Compras
}