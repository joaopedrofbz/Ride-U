const sql = require('mssql')

const con = {
    user: 'admin',
    password: 'pass',
    server: 'localhost',
    database: 'RIDEu',
    options: {
        trustedconnection: true,
        enableArithAbort: true,
        instancename: "DESKTOP-0BGBFV3",
        trustServerCertificate: true,
    },
    port: 1433
}


module.exports = con
