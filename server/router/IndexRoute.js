var express = require('express');
var router = express.Router();
var timeout = require('connect-timeout');
var utils = require('../utils/utils');
var logger = require('../log/Log');

var env = process.env.NODE_ENV;
if(env === 'production'){
    env = '';
}else{
    env += '-';
}
var config = require(`../config/${env}config.json`);

// 首页路由
router.get('/', function(req, res) {
    try {
        logger.LOG(req, `render start.`);
        var options = {
            siteBaseUrl: '',
            frontendBaseUrl: config.siteBase + '/m/static',
            // siteBaseUrl: '/api',
            // frontendBaseUrl: '',
            appVersion: 'web',
            trackingPrefix: 'jhjj',
            platform: req.useragent.isMobile ? 'mobile' : 'pc',
            weixin: true,
            logID: req.logID,
            sentryUrl: config.sentryUrl,
        };
        var optionsStr = JSON.stringify(options);
        logger.LOG(req, `render start options: ${optionsStr}`);
        res.render('index', options);
        logger.LOG(req, `render end.`);
    } catch (e){
        try {
            res.end(e.stack);
            logger.LOG(req, e);
        } catch(e) { }
    }
});

// 测试路由，查找问题时使用
router.get('/test_useragent', function (req, res) {
    try{
        var ua_normal = req.headers['user-agent'];
        var ua_middleware = req.useragent.source;
        var isWeixin = utils.isWeiXin(ua_normal);
        var cookieStr = req.headers['cookie'];
        var cookies = utils.cookieParse(cookieStr);
        var phone = cookies && cookies.phone;
        var app_version = cookies && cookies.app_version;

        logger.LOG(req, `/test_useragent ua_middleware:${ua_middleware}`);

        var options = {
            frontendBaseUrl: config.siteBase + '/m',
            appVersion: app_version,
            trackingPrefix: 'jhjj',
            platform: req.useragent.isMobile ? 'mobile' : 'pc',
            logID: req.logID,
            ua_normal: ua_normal,
            ua_middleware: ua_middleware,
            phone: phone,
            isWeixin: isWeixin
        };
        res.render('test', options);
    }catch(e){
        res.end(e.stack);
        logger.LOG(req, e);
    }
});

module.exports = router;