const dbCreds = require('./dbcreds').connObj

function saveTransaction(mysql, txid, result, remark) {
    var con = mysql.createConnection(dbCreds);
    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = `INSERT INTO TX (txid, result, remark) VALUES ('${txid}', '${result}', '${remark}')`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(`1 record inserted [${txid}, ${result}, ${remark}]`);
        });
    });
}

module.exports = saveTransaction;