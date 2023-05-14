const Lojas = require('./Lojas')


module.exports = (sequelize, DataTypes) => {
    const Logins = sequelize.define('Logins', {
        nome_usuario: DataTypes.STRING(50),
        senha: DataTypes.STRING(64),
        lojas_id: DataTypes.INTEGER,
        adm: DataTypes.TINYINT,
        updatedAt: DataTypes.DATE
    },
    {
        tableName: 'logins',
        timestamps: true
    })

        return Logins
}

