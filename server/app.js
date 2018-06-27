var express = require('express');
var path = require('path');
var compression = require('compression');
var favicon = require('serve-favicon');
var exphbs = require('express-handlebars');
var useragent = require('express-useragent');
var proxy = require('http-proxy-middleware');
var helmet = require('helmet');
var log4js = require('log4js');
var createLogId = require('./log/createLogId');
var logger = require('./log/Log');

var Index = require('./router/IndexRoute');
var rootPath = path.join(__dirname, '..');
var distPath = path.join(rootPath, 'dist');
var app = express();


var env = process.env.NODE_ENV;
if(env === 'production'){
    env = '';
}else{
    env += '-';
}
var config = require(`./config/${env}config.json`);

// 设置favicon
app.use(favicon(path.join(distPath, 'static/img/favicon.png')));

// userAgent解析
app.use(useragent.express());

// 通过设置各种 HTTP 头来帮助保护应用程序
app.use(helmet());

// 压缩response
function shouldCompress (req, res) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false
    }
    // fallback to standard filter function
    return compression.filter(req, res)
}
app.use(compression({filter: shouldCompress}));

// 模板引擎设置
var hbs = exphbs.create({ /* config */ });
app.engine('handlebars', hbs.engine);
// 设置模板文件所在目录
app.set('views', distPath);
// 设置所使用的模板引擎
app.set('view engine', 'handlebars');

app.use(createLogId);

// 不能直接访问模板文件
app.use('m/index.handlebars', function (req, res) {
    return res.redirect('/');
});
app.use('m/test.handlebars', function (req, res) {
    return res.redirect('/test_useragent');
});

// 首页路由处理
app.use('/', Index);

// 日志统计
app.use(log4js.connectLogger(logger));

// 访问静态资源
var staticOption = {
    dotfiles: 'ignore',
    etag: true,
    index: false,
    lastModified: true,
    maxAge: '30d',
    redirect: true,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now());
    }
};
app.use(express.static(distPath, staticOption));

// API代理转发
app.use('/api', proxy(['/api/mil/**', '/api/usercenter/**', '/api/pdl/**','/api/crawlercenter/**', '/api/oa/**'],{
    target: config.proxyURL,
    changeOrigin: true,
    secure: false,
    pathRewrite: {
        '^/api' : ''
    },
}));

// 端口监听
app.listen(config.port, function () {
    console.log(`server listen on ${config.port}`);
});
