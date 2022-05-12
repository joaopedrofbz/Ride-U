var express = require('express');
var router = express.Router();
var con = require('../Database/conn');
const sql = require('mssql');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const nodemailer = require('nodemailer');
var session = require('express-session');
const oneDay = 1000 * 60 * 60 * 24;
const { v4: uuidv4 } = require('uuid')

router.use(
    session({
        secret: uuidv4(),
        resave: true,
        saveUninitialized: false,
        cookie: { maxAge: oneDay },
        resave: false
    })
);

router.get('/', function (req, res, next) {
    res.render('splash');
});
router.get('/home', function (req, res, next) {
    res.render('home');
});

router.get('/registrarCL', function (req, res, next) {
    res.render('registoCliente');
})

router.post('/registrarCL', function (req, res, next) {
    var request = new sql.Request();
    request.input('dataNasc', sql.Date, req.body.dataNasc)
        .input('nome', sql.VarChar(20), req.body.nome)
        .input('nomeMeio', sql.VarChar(20), req.body.nomeMeio)
        .input('apelido', sql.VarChar(20), req.body.apelido)
        .input('genero', sql.Char(1), req.body.genero)
        .input('Telemovel', sql.Int, req.body.Telemovel)
        .execute('spRegistarcl', function (err, result) {
            console.log("result" + JSON.stringify(result))
            console.log("err" + JSON.stringify(err))

            if (result.rowsAffected != null) {
                res.redirect('/registrarClLogin');
            } else {
                res.redirect('/registrarCL');
            }
        });
});

router.get('/registrarClLogin', function (req, res, next) {
    res.render('registoClLogin');
})

router.post('/registrarClLogin', function (req, res, next) {
    var request = new sql.Request();
    request.input('email', sql.VarChar(255), req.body.email)
        .input('password', sql.VarChar(255), req.body.password)
        .execute('spRegistarclLogin', function (err, result) {
            console.log("result" + JSON.stringify(result))
            console.log("err" + JSON.stringify(err))

            if (result.rowsAffected != null) {
                const output = `<p>Email de Verificação Conta RideU</p>
                <p>Introduza o código abaixo na sua aplicação RideU</p><br> ${random}</p>`;
                let transporter = nodemailer.createTransport({
                    host: 'smtp.office365.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: 'Rideu@outlook.pt',
                        pass: 'PaoPaoPao'
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });

                let mailOptions = {
                    from: '"Ride-U" <Rideu@outlook.pt>',
                    to: req.body.email,
                    subject: 'Ride-U| Verificar Email',
                    html: output
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                });
                res.redirect('/registrarClEmail');
            } else {
                res.redirect('/registrarCllogin');
            }
        });
});

router.get('/registrarClEmail', function (req, res, next) {
    res.render('registoClEmail');
})

router.post('/registrarClEmail', function (req, res, next) {
    if (random == req.body.codigo) {
        res.redirect('/registrarClLogin2FA');
    }
});

router.get('/registrarCl2FA', function (req, res, next) {
    console.log(temp_secret);
    qrcode.toDataURL(temp_secret.otpauth_url, function (err, data) {
        res.render('registoClLogin2FA', { codigo: data, manual: temp_secret.base32 });
    });
})

router.post('/registrarCl2FA', function (req, res, next) {
    var request = new sql.Request();
    request.input('secret', sql.VarChar(32), temp_secret.base32)
        .execute('spregistarCl2FA', function (err, result) {
            console.log("result" + JSON.stringify(result))
            console.log("err" + JSON.stringify(err))
            const tokenValidates = speakeasy.totp.verify({
                secret: temp_secret.base32,
                encoding: 'base32',
                token: req.body.token,
                window: 0
            })
            if (tokenValidates == true) {
                res.redirect('/adicionarMetPag')
            } else {
                res.redirect('/registrarCl2FA')
            }
        })
});

router.get('/adicionarMetPag', function (req, res, next) { // Renderiza a pagina html
    res.render('addMetPag');
})

router.post('/adicionarMetPag', function (req, res, next) { //Pede os dados da carta condução
    var request = new sql.Request();
    request.input('ano', sql.Int, req.body.ano)
        .input('mes', sql.Int, req.body.mes)
        .input('numCartao', sql.VarChar(15), req.body.numCartao)
        .input('cvv', sql.Int, req.body.cvv)
        .execute('spRegistarMetPag', function (err, result) {

            if (result.rowsAffected != null) {
                res.redirect('/loginCl');
            } else {
                res.redirect('/adicionarMetPag');
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
        .input('apelido', sql.VarChar(20), req.body.apelido)
        .input('telemovel', sql.Int, req.body.telemovel)
        .input('licTransp', sql.Int, req.body.licTransp)
        .execute('spRegistarCon', function (err, result) {

            if (result.rowsAffected != null) {
                res.redirect('/registrarConLogin');
            } else {
                res.redirect('/registrarCon');
            }
        });
});

router.get('/registrarConLogin', function (req, res, next) { // Renderiza a pagina html
    res.render('registoConLogin');
})

const random = Math.floor(Math.random() * 9999) + 100;

router.post('/registrarConLogin', function (req, res, next) { //Pede os dados de login do cond e insere na bd
    var request = new sql.Request();
    request.input('email', sql.VarChar(255), req.body.email)
        .input('password', sql.VarChar(255), req.body.password)
        .execute('spRegistarConLogin', function (err, result) {


            if (result.rowsAffected != null) {
                const output = `<p>Email de Verificação Conta RideU</p>
                <p>Introduza o código abaixo na sua aplicação RideU</p><br> ${random}</p>`;
                let transporter = nodemailer.createTransport({
                    host: 'smtp.office365.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: 'Rideu@outlook.pt',
                        pass: 'PaoPaoPao'
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });

                let mailOptions = {
                    from: '"Ride-U" <Rideu@outlook.pt>',
                    to: req.body.email,
                    subject: 'Ride-U| Verificar Email',
                    html: output
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                });
                res.redirect('/registrarConfEmail');
            } else {
                res.redirect('/registrarConlogin');
            }
        });
});

router.get('/registrarConfEmail', function (req, res, next) { // Renderiza a pagina html
    res.render('registoConfEmail');
})

router.post('/registrarConfEmail', function (req, res, next) { //Pede os dados pessoais do cond e insere na bd
    if (random == req.body.codigo) {
        res.redirect('/registrarcon2FA');
    }

});
var temp_secret = speakeasy.generateSecret({ length: 20 });
router.get('/registrarCon2FA', function (req, res, next) { // Renderiza a pagina html

    console.log(temp_secret);
    qrcode.toDataURL(temp_secret.otpauth_url, function (err, data) {
        res.render('registoCon2FA', { codigo: data, manual: temp_secret.base32 });
    });

})

router.post('/registrarCon2FA', function (req, res, next) { //Pede os dados pessoais do cond e insere na bd

    var request = new sql.Request();
    request.input('secret', sql.VarChar(32), temp_secret.base32)
        .execute('spregistarCon2FA', function (err, result) {
            console.log("result" + JSON.stringify(result))
            console.log("err" + JSON.stringify(err))
            const tokenValidates = speakeasy.totp.verify({
                secret: temp_secret.base32,
                encoding: 'base32',
                token: req.body.token,
                window: 0
            })
            if (tokenValidates == true) {
                res.redirect('/registrarCartaCond')
            } else {
                res.redirect('/registrarCon2FA')
            }
        })
});

router.get('/registrarCartaCond', function (req, res, next) { // Renderiza a pagina html
    res.render('registrarCartaCond');
})

router.post('/registrarCartaCond', function (req, res, next) { //Pede os dados da carta condução
    var request = new sql.Request();
    request.input('numero', sql.VarChar(12), req.body.numero)
        .input('dataEmissao', sql.Date, req.body.dataEmissao)
        .execute('spRegistarCartaCond', function (err, result) {
            console.log("result" + JSON.stringify(result))
            console.log("err" + JSON.stringify(err))
            if (result.rowsAffected != null) {
                res.redirect('/registrarCarro');
            } else {
                res.redirect('/registrarCartaCond');
            }
        });
});

router.get('/registrarCarro', function (req, res, next) { // Renderiza a pagina html
    res.render('registrarCarro');
})

router.post('/registrarCarro', function (req, res, next) { //Pede os dados do carro do cond e insere na bd
    var request = new sql.Request();
    request.input('marca', sql.VarChar(20), req.body.marca)
        .input('cor', sql.VarChar(20), req.body.cor)
        .input('combustivel', sql.VarChar(10), req.body.combustivel)
        .input('matricula', sql.VarChar(6), req.body.matricula)
        .input('lugares', sql.Int, req.body.lugares)
        .input('DataRegisto', sql.Date, req.body.DataRegisto)
        .input('modelo', sql.VarChar(15), req.body.modelo)
        .input('dua', sql.Int, req.body.dua)
        .execute('spRegistarCarro', function (err, result) {
            console.log("result" + JSON.stringify(result))
            console.log("err" + JSON.stringify(err))
            if (result.rowsAffected != null) {
                res.redirect('/loginCon');
            } else {
                res.redirect('/registrarconCarro');
            }
        })

});

//////////////////////////////////////////////////////////////////////
router.get('/loginCl', function (req, res, next) { 
    res.render('loginCl');
})
router.post('/loginCl', async function (req, res, next) { 


    var request = new sql.Request();
    request.input('email', sql.VarChar(255), req.body.email)
        .input('password', sql.VarChar(255), req.body.password)
        .execute('spLoginCl', function (err, result) {
        
        var data= new sql.Request
        data.input('clcode',sql.Int,result.recordset[0].clcode)
            .execute('spLoginClinfo', function(err,resulta){

            let token=result.recordset[0].token
            const tokenValidates = speakeasy.totp.verify({
                secret: token,
                encoding: 'base32',
                token: req.body.token,
                window: 0
            })
            let clcode=resulta.recordset[0].nome
            let clinfo=result.recordset[0].clcode
            console.log("clcode "+ JSON.stringify(clinfo))
            if (result.rowsAffected > 0 && tokenValidates == true) {

                req.session.user = clcode
                req.session.userinfo=clinfo
                res.redirect('/dashboardCl')

            } else {
                res.redirect('/loginCl');
            }
        })  
        });
})

router.get('/loginCon', function (req, res, next) {
    res.render('loginCon');
})

router.post('/loginCon', async function (req, res, next) {
    var request = new sql.Request();
    request.input('email', sql.VarChar(255), req.body.email)
        .input('password', sql.VarChar(255), req.body.password)
        .execute('spLoginCon', function (err, result) {
        
        var data= new sql.Request
        data.input('concode',sql.Int,result.recordset[0].concode)
            .execute('spLoginConinfo', function(err,resulta){
                
            let concode=resulta.recordset[0].nome
            let token=result.recordset[0].token;
            const tokenValidates = speakeasy.totp.verify({
                secret: token,
                encoding: 'base32',
                token: req.body.token,
                window: 0
            })

            if (result.rowsAffected > 0 && tokenValidates == true) {

                req.session.user = concode
                
                res.redirect('/dashboardCon')

            } else {
                res.redirect('/loginCon');
            }
            })
        });
})
router.get('/dashboardCon', function (req, res, next) { // tentar integrar uma pagina html
    if (req.session.user) {
        console.log(req.session.user)
        res.render('dashboardCon', { user: req.session.user });
    } else {
        res.render('loginCon')
    }
})

router.get('/dashboardCl', function (req, res, next) {
    if (req.session.user) {
        console.log(req.session.user)
        res.render('dashboardCl',{user: req.session.user});//, { user: req.session.user });
    } else {
        res.render('loginCl')
    }
})
/*
router.get('/Metpagamento', function (req, res, next) { // tentar integrar uma pagina html
    var request = new sql.Request();
    request.input('email', sql.VarChar(255), req.session.user)
        .query('select met_numcartao,met_ano,met_mes,met_cvv from cllogin where clo_email=@email and clo_password=@password', function (err, result) {
            res.render('Vermetpagamento',{numcartao=met_numcartao})
        }
})
*/
router.get('/logout', function (req, res, next) { 
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
            res.send("erro");
        } else {
            res.redirect('/')
        }
    })
})

router.get('/painelControlo', function (req, res, next) {
    if(req.session.user) {
    var request = new sql.Request();
    request.input('clinfo', sql.Int, req.session.userinfo)
            .execute('spPainelClinfo',function (err, result){
                if (result.rowsAffected > 0) {
                    res.render('painelControlo',{user: req.session.user,virealizada:result.recordset[0].Virealizada,
                        estatuto:result.recordset[0].estatuto,mediaEstrelas:result.recordset[0].mediaEstrelas,
                        pontoRecolha:result.recordset[0].pontoRecolha,datahora:result.recordset[0].datahora,
                        pontoDestino:result.recordset[0].pontoDestino,datahora2:result.recordset[1].datahora,
                        
                    })
                }console.log("AI "+JSON.stringify( result.recordsets[0].datahora));
            } )
                }else{
                    res.redirect('/loginCl')
                } 
})
router.get('/vermetpagamento', function (req, res, next) {
    if(req.session.user) {
    var request = new sql.Request();
    request.input('clinfo', sql.Int, req.session.userinfo)
            .execute('spMetPagamento',function (err, result){
                if (result.rowsAffected > 0) {
                    res.render('vermetpagamento',{user: req.session.user,numcartao:result.recordset[0].numero,cvv:result.recordset[0].cvv,
                        ano:result.recordset[0].ano,mes:result.recordset[0].mes
                        
                    })
                }
            } )
                }else{
                    res.redirect('/loginCl')
                } 
})


module.exports = router; 