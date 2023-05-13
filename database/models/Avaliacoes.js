const Usuarios = require('./Usuarios')

module.exports = (sequelize, DataTypes) => {
    const Avaliacoes = sequelize.define('Avaliacoes', {
        lojas_id: DataTypes.INTEGER,
        usuarios_id: DataTypes.INTEGER,
        avaliacao: DataTypes.TINYINT
    },
    {
        tableName: 'avaliacoes',
        timestamps: true
    })

        return Avaliacoes
}
