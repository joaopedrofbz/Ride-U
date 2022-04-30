var config = require("./connection");
const sql = require("mssql");

module.exports.getlogin = async function () {
    try {

        let pool =await sql.connect(config);
        let clientes = await pool.request().query("select * from Cliente");
        return  clientes.recordsets;

    } catch (error) {
        console.log(error)
        
    }
}




