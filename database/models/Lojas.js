const Logins = require('./Logins')


module.exports = (sequelize, DataTypes) => {
    const Lojas = sequelize.define('Lojas', {
        nome_loja: DataTypes.STRING(100),
        cashback_percent: DataTypes.DECIMAL(9,2),
        updatedAt: DataTypes.DATE
    },
    {
        tableName: 'lojas',
        timestamps: true
    })

    Lojas.associate = models => {
        Lojas.hasMany(models.Cashback, {
            foreignKey: 'lojas_id',
            as: 'cashback'
        })
    }

        return Lojas
}