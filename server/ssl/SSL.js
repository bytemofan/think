var fs = require('fs');
var path = require('path');

var keyPath = path.resolve(__dirname, './ssl/certificate_key.pem');
var certPath = path.resolve(__dirname, './ssl/certificate.pem');

var hskey = fs.readFileSync(keyPath, 'utf8');
var hscert = fs.readFileSync(certPath, 'utf8');

var options = {
    key: hskey,
    cert: hscert
};

var ssl = {};
ssl.options = options;

module.exports = ssl;