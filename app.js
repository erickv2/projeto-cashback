const express = require('express')
const path = require('path')
const app = express()
const bodyParser = require('body-parser');
app.set('view engine', 'ejs')
const router = require('./router');
const routerApi = require('./api/routerApi');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(router)
app.use('/api/v1', routerApi)

app.listen(3000)

