const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataType) => {
    const Compras = sequelize.define('Compras', {
        data_hora: DataType.DATETIME,
        valor: DataType.DECIMAL(5,2)
    })
    return Compras
}