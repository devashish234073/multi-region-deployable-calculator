const express = require('express')
const app = express()
const port = 3002
const url = require('url');
const querystring = require('querystring');
var mysql = require('mysql');
const saveTransaction = require('../dbCommons');

app.get('/sub', (req, res) => {
    let parsedUrl = url.parse(req.url);
    let parsedQs = querystring.parse(parsedUrl.query);
    let num1 = parseFloat(parsedQs.num1);
    let num2 = parseFloat(parsedQs.num2);
    let result = (num1 - num2);
    saveTransaction(mysql,parsedQs.txid,result,`${num1}-${num2}=${result}`)
    res.end("transaction id: " + parsedQs.txid);
})

app.listen(port, () => console.log(`App listening on port ${port}!`))