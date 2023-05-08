const verificaSeLogado = (req, res, next) => {
    
    if(req.session.loginAdm){
        next();
    } else {
        res.redirect('/adm/login');
    }
}

module.exports = verificaSeLogado;