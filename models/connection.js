const sql = require('mssql')

const config = {
    user: 'admin',
    password: 'pass',
    server: '127.0.0.1',
    database: 'RIDEu',
    options: {
        trustedconnection: true,
        enableArithAbort: true,
        instancename:"DESKTOP-0BGBFV3",
    },
    port:1433
}

module.exports = config
