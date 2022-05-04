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
//registrar condutor
router.get('/registrarCon', function (req, res, next) { // Renderiza a pagina html
    res.render('registoCond');
})

router.post('/registrarCon', function (req, res, next) { //Pede os dados pessoais do cond e insere na bd
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
            res.redirect('/registrarConLogin')
        });
});

router.get('/registrarConLogin', function (req, res, next) { // Renderiza a pagina html
    res.render('registoConLogin');
})

router.post('/registrarConLogin', function (req, res, next) { //Pede os dados de login do cond e insere na bd
    var request = new sql.Request();
    request.input('email', sql.VarChar(255), req.body.email)
        .input('password', sql.VarChar(255), req.body.password)     
        .query('INSERT INTO Conlogin VALUES (@email, @password,NULL)', function (err, result) {
            console.log("result"+JSON.stringify(result))
            console.log("err"+JSON.stringify(err))
            res.redirect('/registrarConLogin2FA')
        });
});

router.get('/registrarConLogin2FA', function (req, res, next) { // Renderiza a pagina html
    res.render('registoConLogin2FA');
})

router.post('/registrarConLogin2FA', function (req, res, next) { //Pede os dados pessoais do cond e insere na bd
    var request = new sql.Request();                            //falta query
    request.input('secret', sql.VarChar(20), req.body.secret)
        .query('INSERT INTO Conlogin VALUES (@email, @password)', function (err, result) {
            console.log("result"+JSON.stringify(result))
            console.log("err"+JSON.stringify(err))
            res.redirect('/registrarCartaCond')
        });
});

router.get('/registrarCartaCond', function (req, res, next) { // Renderiza a pagina html
    res.render('registrarCartaCond');
})

router.post('/registrarCartaCond', function (req, res, next) { //Pede os dados da carta condução
    var request = new sql.Request();
    request.input('numero', sql.VarChar(20), req.body.numero)
        .input('dataEmissao', sql.Date, req.body.dataEmissao)
        .query('INSERT INTO CartaConducao VALUES (@numero,@dataEmissao)', function (err, result) {
            console.log("result"+JSON.stringify(result))
            console.log("err"+JSON.stringify(err))
            res.redirect('/registrarConCarro')
        });
});

router.get('/registrarConCarro', function (req, res, next) { // Renderiza a pagina html
    res.render('registoConCarro');
})

router.post('/registrarConCarro', function (req, res, next) { //Pede os dados do carro do cond e insere na bd
    var request = new sql.Request();
    request.input('marca', sql.VarChar(20), req.body.marca)
        .input('cor', sql.VarChar(20), req.body.cor)
        .input('combustivel', sql.VarChar(10), req.body.combustivel)
        .input('matricula', sql.VarChar(6), req.body.matricula)
        .input('lugares', sql.Int, req.body.lugares)
        .input('DataRegisto', sql.Date, req.body.DataRegisto) 
        .input('modelo', sql.VarChar(15), req.body.modelo)     
        .input('dua', sql.Int, req.body.dua)     
        .query('INSERT INTO Carro VALUES (@marca,@cor,@combustivel,@matricula,@lugares,@DataRegisto,@modelo,@dua)', function (err, result) {
            console.log("result"+JSON.stringify(result))
            console.log("err"+JSON.stringify(err))
            res.redirect('/registar')
        });
});


//////////////////////////////////////////////////////////////////////
router.get('/loginCl', function (req, res, next) { // tentar integrar uma pagina html
    res.render('loginCl');
})
router.post('/loginCl', async function (req, res, next) { //test login cliente
    console.log("result"+JSON.stringify(req.body))
    var request = new sql.Request();
    request.input('email', sql.VarChar(255), req.body.email)
        .input('password', sql.VarChar(255), req.body.password)
        .query('select clo_email,clo_password from cllogin where clo_email=@email and clo_password=@password', function (err, result) {
            console.log("result"+JSON.stringify(result))
            console.log("err"+JSON.stringify(err))
            if(result.rowsAffected> 0){              
                res.redirect('/');
            } else {
                res.redirect('/loginCl');
            } 
        });
})

router.get('/loginCon', function (req, res, next) { // tentar integrar uma pagina html
    res.render('loginCon');
})

router.post('/loginCon', async function (req, res, next) { //test login
    console.log("result"+JSON.stringify(req.body))  //query
    var request = new sql.Request();
    request.input('email', sql.VarChar(255), req.body.email)
        .input('password', sql.VarChar(255), req.body.password)
        .query('select co_email,co_password from conlogin where co_email=@email and co_password=@password', function (err, result) {
            console.log("result"+JSON.stringify(result))
            console.log("err"+JSON.stringify(err))
            if(result.rowsAffected> 0){              
                res.redirect('/');
            } else {
                res.redirect('/loginCon');
            } 
        });
})



module.exports = router; 