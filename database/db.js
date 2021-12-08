const mysql = require('mysql');


/*module.exports = function(database='GESTION'){
    return mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port:process.env.port,
    database: process.env.DATABASE   
    })}*/
const conexion = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE 
})
 module.exports = conexion