const Usuarios = require('./Usuarios')

module.exports = (sequelize, DataTypes) => {
    const Avaliacoes = sequelize.define('Avaliacoes', {
        lojas_id: DataTypes.INTEGER,
        usuarios_id: DataTypes.INTEGER,
        avaliacao: DataTypes.TINYINT,
        texto: DataTypes.TEXT
    },
    {
        tableName: 'avaliacoes',
        timestamps: false
    })
    Avaliacoes.removeAttribute('id')
        return Avaliacoes
}
