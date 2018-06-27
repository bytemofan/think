module.exports = {
    isWeiXin: function (source) {
        var ua = source.toLowerCase();
        return ua.match(/MicroMessenger/i) == 'micromessenger';
    },
    cookieParse: function (cookieStr) {
        var ret = {};
        if(cookieStr){
            var cookies = cookieStr.split(';');
            if(cookies.length > 0){
                for(var i = 0; i < cookies.length; i++){
                    var cookie = cookies[i].split('=');
                    if(cookies && cookie.length > 0){
                        ret[cookie[0].replace(/^\s/, '')] = cookie[1];
                    }
                }
            }
        }
        return ret;
    }
};