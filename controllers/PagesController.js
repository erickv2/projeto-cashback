const path = require('path');
const idu = 2;

const PagesController = {

    showIndex: (req, res)=>{
        return res.render('index');
    }
}

module.exports = PagesController