var md5 = require('../utils/md5');

module.exports = function (req, res, next) {
    var startTime = new Date().getTime();
    var random = Math.floor(Math.random() * 100);

    req.logID = md5(startTime.toString() * 100 + random);

    next();
};