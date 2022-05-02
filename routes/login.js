var express = require('express');
var router = express.Router();
var con = require('../Database/conn');
const sql = require('mssql');
const { request } = require('express');

function execSQLQuery(sqlQry, res) {
    global.conn.request()
        .query(sqlQry)
        .then(result => res.json(result.recordset))
        .catch(err => res.json(err));
}

router.get('/', function (req, res, next) { // tentar integrar uma pagina html
    res.render('login');
});
router.get('/home', function (req, res, next) { // tentar integrar uma pagina html
    res.render('home');
});
router.get('/clienteslog', (req, res) => {
    execSQLQuery('SELECT * FROM Cllogin', res);
})

router.post('/registrarCL', function (req, res, next) {
    var request = new sql.Request();
    request.input('email', sql.VarChar(255), req.body.email)
        .input('password', sql.VarChar(255), req.body.password)
        .query('insert into cllogin values (@email,@password)', function (err, result) {
        });
})


router.post('/login', async function (req, res, next) { //test login
    var request = new sql.Request();
    request.input('email', sql.VarChar(255), req.body.email)
        .input('password', sql.VarChar(255), req.body.password)
        .query('select clo_email,clo_pass from cl_login where clo_email=@email and clo_pass=@password', function (err, result) {

            if (req.session.email == req.body.email && req.session.password == req.body.password) {

                res.redirect('/home');
            } else {
                res.redirect('/');
            }
        });
})



module.exports = router; 