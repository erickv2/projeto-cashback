module.exports = {
  "development": {
    "username": "root",
    "password": null,
    "database": "projeto_cashback",
    "host": "127.0.0.1",
    "dialect": "mysql",
    // essa linha é necessária para que os números decimais sejam reconhecidos
    dialectOptions: { decimalNumbers: true }
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "projeto_cashback",
    "host": "127.0.0.1",
    "dialect": "mysql",
    dialectOptions: { decimalNumbers: true }
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "projeto_cashback",
    "host": "127.0.0.1",
    "dialect": "mysql",
    dialectOptions: { decimalNumbers: true }
  }
}
