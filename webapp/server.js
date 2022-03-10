const request_ = require('request')
const express = require('express')
const dbCreds = require('../dbcreds').connObj
var uuid = require('uuid');
const app = express()
const port = 3000
const url = require('url');
const querystring = require('querystring');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
const addAPIURL = "http://localhost:3001/add";
const subAPIURL = "http://localhost:3002/sub";
const mulAPIURL = "http://localhost:3003/mul";
const divAPIURL = "http://localhost:3004/div";

function callApi(url) {
    return new Promise((resolve, reject) => {
        request_(url, { json: true }, (err, res, body) => {
            if (err) reject(err)
            resolve(body)
        });
    })
}

var mysql = require('mysql');

app.post('/calculate', (req, res) => {
    //let parsedUrl = url.parse(req.url);
    let parsedQs = req.body;// querystring.parse(parsedUrl.query);
    let apiURL = "";
    if (parsedQs.oper == undefined || parsedQs.oper == "ADD") {
        apiURL = addAPIURL;
    } else if (parsedQs.oper == "SUB") {
        apiURL = subAPIURL;
    } else if (parsedQs.oper == "MUL") {
        apiURL = mulAPIURL;
    } else if (parsedQs.oper == "DIV") {
        apiURL = divAPIURL;
    }
    let txid = uuidv4();
    apiURL += `?num1=${parsedQs.num1}&num2=${parsedQs.num2}&txid=${txid}`;
    console.log(`calling ${apiURL} ......`);
    try {
        callApi(apiURL)
        .then(response => {
            res.json(response)
        })
        .catch(error => {
            console.log("F1 error ["+error+"]");
            res.end(String(error))
        })
    } catch(e) {
        console.log("F2 error");
        res.end(String(e))
    }
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/checkTransactionStatus', (req, res) => {
    let parsedUrl = url.parse(req.url);
    let parsedQs = querystring.parse(parsedUrl.query);
    var con = mysql.createConnection(dbCreds);
    con.connect(function (err) {
        if (err) throw err;
        var sql = `SELECT * FROM TX WHERE txid='${parsedQs.txid}'`;
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.end(JSON.stringify(result[0].remark));
        });
    });
})

function uuidv4() {
    return uuid.v4()
}

app.listen(port, () => console.log(`App listening on port ${port}!`))