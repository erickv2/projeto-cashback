const express = require('express')
const path = require('path')
const app = express()
app.set('view engine', 'ejs')
const router = require('./router');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use(router)

app.listen(3000)

