const express = require('express')
const path = require('path')
const app = express()
const bodyParser = require('body-parser');
const session = require("express-session");
app.set('view engine', 'ejs')
const router = require('./router');
const routerApi = require('./api/routerApi');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
var cookieParser = require('cookie-parser')

app.use(cookieParser())

app.use(session({
    secret: "ultrassecreto",
    resave: true,
    saveUninitialized: true
}
));

app.use(

    (req, res, next) => {
        if (req.session.loginAdm) {
            console.log("Administrador logado");
        } else {
            console.log("Administrador deslogado");
        }
        next();
    }

)

app.use(

    (req, res, next) => {
        if (req.session.loginLoja) {
            console.log("Lojista logado");
        } else {
            console.log("Lojista deslogado");
        }
        next();
    }

)

app.use(router)
app.use('/api/v1', routerApi)

app.listen(3000)
