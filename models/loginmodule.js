var config = require("./connection");
const sql = require("mssql");

module.exports.getlogin = async function () {
    try {

        let pool =await sql.connect(config);
        let clientes = pool.request().query("select * from Sadmin.Cliente");
        console.log("[loginmodule.getLogin] clientes= " + JSON.stringify(clientes));
        return (await clientes).recordsets;

    } catch (err) {
        console.log(err)
        return { status: 500, data: err };
    }
}
module.exports.getconect = async function getconect() {
    try {
        await sql.connect(config);
        console.log("sql connection established");
        return { status: 200 };
    } catch (error) {
        console.log(error.message);
        return { status: 500, data: err };
    }


}




