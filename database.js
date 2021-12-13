const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'tpUNSTA2021',
    database: 'academia'
});

mysqlConnection.connect (function (err) {
    if(err) {
        console.log(err);
        return;
    } else {
        console.log('Conexión DB exitosa');
    }
});

module.exports = mysqlConnection;