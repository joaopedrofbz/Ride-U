
/*
var con = require("/connection");

/*
models.use(session({
    secret:req.cookies,
    resave:true,
    saveUninitialized:true,
    cookie:{secure:true},
}));

module.exports.getlogin = async function (request, response) {
    
    var email = request.body.email;
    var password = request.body.password;
    
    try {
        req.query("Select * from logincl where clo_email = ? and clo_password = ?");
        var req = await pool.Request(req);
        let login = results.rows;
        return { status: 200, data: login };
        
    } catch (err) {
        console.log(err);
        return{status: 500, data: err};
    }

        /*
        if (email && password){
        req.query('Select * from logincl where clo_email = ? and clo_password = ?', [email, password], function (error, results) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.email = email;
                response.redirect('/2FAVerifyLogin');
            }else {
                response.send('email e ou Password Invaludas');
            }
            response.end();
        });
        
        }else {
            response.send('Introduza email');
}
*/




