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

//registar cliente
router.get('/registrarCL', function (req, res, next) { // tentar integrar uma pagina html
    res.render('registoCliente');
})

router.post('/registrarCL', function (req, res, next) { //Pede os dados pessoais do cond e insere na bd
    var request = new sql.Request();
    request.input('dataNasc', sql.Date, req.body.dataNasc)
        .input('nome', sql.VarChar(20), req.body.nome)
        .input('nomeMeio', sql.VarChar(20), req.body.nomeMeio)
        .input('apelido',sql.VarChar(20), req.body.apelido)
        .input('genero', sql.Char(1), req.body.genero)
        .input('Telemovel', sql.Int, req.body.Telemovel)
        .query('INSERT INTO Cliente VALUES (@dataNasc,@nome,@nomeMeio,@apelido,@genero,@Telemovel)', function (err, result) {
            console.log("result"+JSON.stringify(result))
            console.log("err"+JSON.stringify(err))

            if(result.rowsAffected> 0){              
                res.redirect('/registrarClLogin');
            } else {
                res.redirect('/registrarCL');
            } 
        });
});

router.get('/registrarClLogin', function (req, res, next) { // Renderiza a pagina html
    res.render('registoClLogin');
})

router.post('/registrarClLogin', function (req, res, next) { //Pede os dados de login do cond e insere na bd
    var request = new sql.Request();
    request.input('email', sql.VarChar(255), req.body.email)
        .input('password', sql.VarChar(255), req.body.password)     
        .query('INSERT INTO Cllogin VALUES (@email, @password,NULL)', function (err, result) {
            console.log("result"+JSON.stringify(result))
            console.log("err"+JSON.stringify(err))
            if(result.rowsAffected> 0){              
                res.redirect('/registrarClLogin2FA');
            } else {
                res.redirect('/registrarClLogin');
            } 
        });
});

router.get('/registrarClLogin2FA', function (req, res, next) { // Renderiza a pagina html
    res.render('registoClLogin2FA');
})

router.post('/registrarClLogin2FA', function (req, res, next) { //Pede os dados pessoais do cond e insere na bd
    var request = new sql.Request();                            //falta query
    request.input('secret', sql.VarChar(20), req.body.secret)
        .query('INSERT INTO Conlogin VALUES (@email, @password)', function (err, result) {
            console.log("result"+JSON.stringify(result))
            console.log("err"+JSON.stringify(err))
            res.redirect('/adicionarMetPag')
        });
});

router.get('/adicionarMetPag', function (req, res, next) { // Renderiza a pagina html
    res.render('addMetPag');
})

router.post('/adicionarMetPag', function (req, res, next) { //Pede os dados da carta condução
    var request = new sql.Request();
    request.input('ano', sql.Int, req.body.ano)
        .input('mes', sql.Int, req.body.mes)
        .input('numCartao', sql.VarChar(15), req.body.mes)
        .input('CVV', sql.Int, req.body.mes)
        .query('INSERT INTO CartaConducao VALUES (@ano,@mes,@numCartao,@CVV)', function (err, result) {
            console.log("result"+JSON.stringify(result))
            console.log("err"+JSON.stringify(err))
            if(result.rowsAffected> 0){              
                res.redirect('/adicionarMetPag');
            } else {
                res.redirect('/loginCl');
            } 
        });
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

            if(result.rowsAffected> 0){              
                res.redirect('/registrarConLogin');
            } else {
                res.redirect('/registrarCon');
            } 
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
            if(result.rowsAffected> 0){              
                res.redirect('/registrarConLogin2FA');
            } else {
                res.redirect('/registrarConlogin');
            } 
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
            res.redirect('/registrarconCartaCond')
        });
});

router.get('/registrarconCartaCond', function (req, res, next) { // Renderiza a pagina html
    res.render('registrarCartaCond');
})

router.post('/registrarconCartaCond', function (req, res, next) { //Pede os dados da carta condução
    var request = new sql.Request();
    request.input('numero', sql.VarChar(12), req.body.numero)
        .input('dataEmissao', sql.Date, req.body.dataEmissao)
        .query('INSERT INTO CartaConducao VALUES (@numero,@dataEmissao)', function (err, result) {
            console.log("result"+JSON.stringify(result))
            console.log("err"+JSON.stringify(err))
            if(result.rowsAffected> 0){              
                res.redirect('/registrarconCarro');
            } else {
                res.redirect('/registrarconCartaCond');
            } 
        });
});

router.get('/registrarconCarro', function (req, res, next) { // Renderiza a pagina html
    res.render('registrarCarro');
})

router.post('/registrarconCarro', function (req, res, next) { //Pede os dados do carro do cond e insere na bd
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
            if(result.rowsAffected> 0){              
                res.redirect('/loginCon')
            } else {
                res.redirect('/registrarCarro');
            } 
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