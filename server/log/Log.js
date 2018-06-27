var log4js = require('log4js');
var path = require('path');
var utils = require('../utils/utils');

// 日志配置
log4js.configure({
    appenders: {
        console: { type: 'console' },
        file: {
            type: 'dateFile',
            filename: path.join(__dirname,'../../../','logs/access.log'),
            compress: true, // 压缩日志
            daysToKeep: 30, // 日志保留30天
            pattern: '.yyyy-MM-dd',
            layout: {
                type: 'pattern',
                pattern: '[%d %z][%p] %c - %X{logID} - %m%n'
            }
        }
    },
    categories: {
        default: { appenders: ['console'], level: 'debug' },
        log4jslog: { appenders: ['file'], level: 'debug' }
    },
    pm2: true
});

// 访问日志
var logger = log4js.getLogger('log4jslog');

logger.LOG = function (req, info) {
    logger.addContext('logID', req.logID);
    try{
        var ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var host = req.headers['x-forwarded-host'] || req.hostname;
        var userAgent = req.headers['user-agent'];
        var cookieStr = req.headers['cookie'];
        var logID = req.logID;
        var cookies = utils.cookieParse(cookieStr);
        var phone = cookies.phone;
        var app_version = cookies.app_version;

        ip = ip.substring(7, ip.length - 1);
        logger.info(`ip:${ip} phone:${phone} app_version:${app_version} message:${info} userAgent:${userAgent}`);
    }catch(e){}
};

module.exports = logger;