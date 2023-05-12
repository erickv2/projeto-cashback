const verificaSeLogado = (req, res, next) => {
    
    if(req.session.loginLoja){
        next();
    } else {
        res.redirect('/loja/login');
    }
}

module.exports = verificaSeLogado;