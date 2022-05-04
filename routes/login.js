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
    console.log("request = " + JSON.stringify(req.body));
    var request = new sql.Request();
    try {
        request.input('CldataNasc', sql.Date, req.body.CldataNasc)
        .input('Clnome', sql.VarChar(20), req.body.Clnome)
        .input('ClnomeMeio', sql.VarChar(20), req.body.ClnomeMeio)
        .input('Clapelido',sql.VarChar(20), req.body.Clapelido)
        .input('Clgenero', sql.Char(1), req.body.Clgenero)
        .input('ClTelemovel', sql.Int, req.body.ClTelemovel)
        .query('INSERT INTO Cliente VALUES (@CldataNasc,@Clnome,@ClnomeMeio,@Clapelido,@Clgenero,@ClTelemovel)', function (err, result) {
            console.log("result=" + JSON.stringify(result))
            console.log("err=" + err)
            res.redirect('/')
        });
    } catch (error) {
        console.log("error=" + error)
    }
    
});

router.get('/registrarCon', function (req, res, next) { // tentar integrar uma pagina html
    res.render('registoCond');
})

router.post('/registrarCon', function (req, res, next) {
    var request = new sql.Request();
    request.input('dataNasc', sql.Date, req.body.dataNasc)
        .input('genero', sql.Char(1), req.body.genero)
        .input('CC', sql.VarChar(8), req.body.CC)
        .input('NIF', sql.Int, req.body.NIF)
        .input('nome', sql.VarChar(20), req.body.nome)
        .input('nomeMeio', sql.VarChar(20), req.body.nomeMeio)
        .input('apelido',sql.VarChar(20), req.body.apelido)
        .input('telemovel', sql.Int, req.body.telemovel)  
        .input('licTransp', sql.Int, req.body.licTransp)      
        .query('INSERT INTO Condutor VALUES (@dataNasc,@genero,@CC,@NIF,@nome,@nomeMeio,@apelido,@telemovel,@licTransp)', function (err, result) {
            console.log("result"+JSON.stringify(result))
            console.log("err"+JSON.stringify(err))
            res.redirect('/')
        });
});


router.post('/login', async function (req, res, next) { //test login
    console.log("result"+JSON.stringify(req.body))
    var request = new sql.Request();
    request.input('email', sql.VarChar(255), req.body.email)
        .input('password', sql.VarChar(255), req.body.password)
        .query('select clo_email,clo_pass from cllogin where clo_email=@email and clo_pass=@password', function (err, result) {
            console.log("result"+JSON.stringify(result))
            console.log("err"+JSON.stringify(err))
            if(result.rowsAffected> 0){
                            
                res.redirect('/');
            } else {
                res.redirect('/login');
            }
            
        });
})



module.exports = router; 