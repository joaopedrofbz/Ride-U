var express = require('express');
var router = express.Router();
var con = require('../Database/conn');
const sql = require('mssql');


function execSQLQuery(sqlQry, res) {
    global.conn.request()
        .query(sqlQry)
        .then(result => res.json(result.recordset))
        .catch(err => res.json(err));
}

router.get('/', function (req, res, next) { // tentar integrar uma pagina html
    res.render('splash');
});
router.get('/home', function (req, res, next) { // tentar integrar uma pagina html
    res.render('home');
    

});

router.get('/login', function (req, res, next) { // tentar integrar uma pagina html
    res.render('login');
})

router.get('/clienteslog', (req, res) => {
    execSQLQuery('SELECT * FROM Cllogin', res);
})
router.get('/registrarCL', function (req, res, next) { // tentar integrar uma pagina html
    res.render('registoCliente');
})
router.post('/registrarCL', function (req, res, next) {
    
    var request = new sql.Request();
    request.input('CldataNasc', sql.Date, req.body.CldataNasc)
        .input('Clnome', sql.VarChar(20), req.body.clnome)
        .input('ClnomeMeio', sql.VarChar(20), req.body.ClnomeMeio)
        .input('Clapelido',sql.VarChar(20), req.body.Clapelido)
        .input('Clgenero', sql.Char(1), req.body.Clgenero)
        .input('ClTelemovel', sql.Int, req.body.ClTelemovel)
        .input('Clemail', sql.VarChar(255), req.body.Clemail)
        .query('INSERT INTO Cliente VALUES (@CldataNasc, @Clnome,@ClnomeMeio,@Clapelido,@Clgenero,@ClTelemovel,@Cllemail)', function (err, result) {
            res.redirect('/')
        });
});

router.get('/registrarCon', function (req, res, next) { // tentar integrar uma pagina html
    res.render('registoCond');
})

router.post('/registrarCon', function (req, res, next) {
    
    var request = new sql.Request();
    request.input('CldataNasc', sql.Date, req.body.CldataNasc)
        .input('Clnome', sql.VarChar(20), req.body.clnome)
        .input('ClnomeMeio', sql.VarChar(20), req.body.ClnomeMeio)
        .input('Clapelido',sql.VarChar(20), req.body.Clapelido)
        .input('Clgenero', sql.Char(1), req.body.Clgenero)
        .input('ClTelemovel', sql.Int, req.body.ClTelemovel)
        .input('Clemail', sql.VarChar(255), req.body.Clemail)
        .query('INSERT INTO Cliente VALUES (@CldataNasc, @Clnome,@ClnomeMeio,@Clapelido,@Clgenero,@ClTelemovel,@Cllemail)', function (err, result) {
            res.redirect('/')
        });
});

/*
router.post('/login', async function (req, res, next) { //test login
    var request = new sql.Request();
    request.input('email', sql.VarChar(255), req.body.email)
        .input('password', sql.VarChar(255), req.body.password)
        .query('select clo_email,clo_pass from cl_login where clo_email=@email and clo_pass=@password', function (err, result) {

            if (req.session.email == req.body.email && req.session.password == req.body.password) {

                res.redirect('/');
            } else {
                res.redirect('/login');
            }
        });
})
*/
router.post('/login', async function (req, res, next) { //test login
    var request = new sql.Request();
    request.input('email', sql.VarChar(255), req.body.email)
        .input('password', sql.VarChar(255), req.body.password)
        .query('insert into cllogin values (@email,@password)', function (err, result) {
            res.redirect('/login');
        });
})



module.exports = router; 