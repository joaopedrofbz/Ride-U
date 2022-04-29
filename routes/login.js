var express = require('express');
var router = express.Router();
var loginModel = require('../models/loginmodule');


router.get('/', async function (req, res, next) {
    console.log("[loginrouter] A mandar os clientes");
    let result = await loginModel.getlogin();
    res.status(result.status).send(result.data);
});

router.post("/totp-secret", async function (request, response, next) {
    var secret = Speakeasy.generateSecret({ length: 20 });
    response.send({ "secret": secret.base32 });
});

router.post("/totp-generate", async function (request, response, next) {
    response.send({
        "token": Speakeasy.totp({
            secret: request.body.secret,
            encoding: "base32"
        }),
        "remaining": (30 - Math.floor((new Date()).getTime() / 1000.0 % 30))
    });
});

router.post("/totp-validate", async function (request, response, next) {
    response.send({
        "valid": Speakeasy.totp.verify({
            secret: request.body.secret,
            encoding: "base32",
            token: request.body.token,
            window: 0
        })
    });
});

module.exports = router; 