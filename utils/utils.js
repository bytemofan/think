/**
 * Created by chw on 17/9/22
 */
import assign from 'object-assign';
import { app } from '../framework7';
import { setLocation } from '../actions/common';
import API from '../api';

const u = window.navigator.userAgent.toLowerCase();

const utils = {
    /**
     * 金额计算相关方法
     */
    amount: {
        centsToFixed: cent => +cent.toFixed(2),
        centsToDollars: cent => cent/100,
        centsToYuan: cent => cent / 100 + '元',
        centsToDollarsFixed2: cent => (cent / 100).toFixed(2),
        centsToDollarsFixed2Int: (cent) => {
            cent = (cent / 100).toFixed(2);
            if(/\.00$/.test(cent)){
                return cent.replace(/\.00$/, '');
            }else{
                return cent;
            }
        }
    },
    /**
     * 日期计算相关方法
     */
    date: {
        toDateString: function (d) {
            let date = this.parseDate(d);
            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        },
        toChineseDateString: function (d) {
            let date = this.parseDate(d);
            return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
        },
        parseDate: function (date) {
            if (typeof date == 'string' || typeof date == 'number'){
                return new Date(date);
            }else if(!date){
                return new Date();
            }else {
                return date;
            }
        }
    },
    /**
     * 统计相关方法
     */
    tracking: {
        trackPageLoad: (page) => {
            try {
                _lmt.trackPageView(page);
            } catch (ex) {}
        },
        setCommonData: (key,value) => {
            try {
                _lmt.setCommonData(key, value);
            } catch (ex) {}
        },
        /**
         * 解析url的search，生成query对象
         * @returns {{}}
         */
        parseUrl: () => {
            var ret = {};
            var search = window.location.search.substr(1) || window.location.hash.split('?')[1];
            if(search){
                var arr = search.split('&');
                for(var i = 0; i < arr.length; i++){
                    var m = arr[i].split('=');
                    if(m[0] !== '_k'){
                        ret[m[0]] = m[1];
                    }
                }
            }
            return ret;
        },
        trackEvent: function(event, options){
            let query = this.parseUrl();
            let _jhjj_uuid = window.localStorage.getItem('_jhjj_uuid') || '';
            let _jhjj_ut = window.localStorage.getItem('_jhjj_ut') || '';

            try {
                _lmt.trackEvent(event, assign({}, options, {
                    'userid':_lmt.cookies('_lmt_track_id'),
                    'phone': options.phone || _lmt.cookies('phone'),
                    'utm_source': _lmt.cookies('utm_source_sess') || query.utm_source,
                    'jhjj_uuid':_jhjj_uuid,
                    'jhjj_ut':_jhjj_ut,
                }));
            } catch (ex) {}
        }
    },
    /**
     * 判断客户端信息
     */
    userAgent: {
        useragent : u,
        trident: u.indexOf('trident') > -1, //IE内核
        presto: u.indexOf('presto') > -1, //opera内核
        webKit: u.indexOf('applewebkit') > -1, //苹果、谷歌内核
        ie: u.indexOf('msie') > -1, // IE
        Moz: u.indexOf('gecko') > -1, // Moz
        gecko: u.indexOf('gecko') > -1 && u.indexOf('khtml') == -1,//火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/i), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/i), //ios终端
        android: u.indexOf('android') > -1 || u.indexOf('adr') > -1, //android终端
        iPhone: u.indexOf('iphone') > -1 , //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('ipad') > -1, //是否iPad
        webApp: u.indexOf('safari') == -1, //是否web应该程序，没有头部与底部
        weixin: u.match(/MicroMessenger/i) == "micromessenger" ,//是否微信
        qq: u.match(/\sQQ/i) == " qq" ,//是否QQ
    },
    /**
     * 解析url
     * @param str
     * @param key
     * @returns {string}
     */
    getUrlKey: (...args) => {
        let str='', key='';
        if(args.length > 1){
            key = args[0];
            if(args[1].indexOf('?') > -1){
                str = args[1].substring(1);
            }
        }else {
            str = window.location.search.substring(1);
            key = args[0];
        }
        if (str.indexOf(key) > -1) {
            let arr = str.split('&');
            let obj = {};
            for (let i in arr) {
                let arr2 = arr[i].split('=');
                obj[arr2[0]] = arr2[1]
            }
            if (obj && obj.hasOwnProperty(key)) {
                return obj[key];
            }
        }
        return '';
    },
    /**
     * params转字符串形式
     * @param params
     * @returns {string}
     */
    paramsToString: (params) => {
        let ret = '';
        if(params){
            for(let p in params){
                ret += p + '=' + encodeURIComponent(params[p]) + '&';
            }
        }
        ret.replace(/&$/,'');
        return ret;
    },
    /**
     * 定位相关
     * @param dispatch store中的dispatch方法，用于派发action更新定位数据
     */
    getLocation: (dispatch) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (pos) {
                let latitude = pos.coords.latitude;
                let longitude = pos.coords.longitude;
                dispatch(setLocation({
                    latitude: latitude,
                    longitude: longitude
                }));
                window.localStorage.setItem('longitude', longitude);
                window.localStorage.setItem('latitude', latitude);
            });
        } else {
            console.log('Geolocation is not supported by this browser.');
            try {
                if (wx) {
                    wx.getLocation({
                        //     默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                        type: 'wgs84',
                        success(res){
                            dispatch(setLocation({
                                latitude: res.latitude, //纬度，浮点数，范围为90~-90
                                longitude: res.longitude, //经度，浮点数，范围为180~-180
                                speed: res.speed, //速度，以米 / 每秒计
                                accuracy: res.accuracy //位置精度
                            }));
                            window.localStorage.setItem('longitude', res.longitude);
                            window.localStorage.setItem('latitude', res.latitude);
                        }
                    })
                }
            } catch (e) {
                console.log('wx is not config');
            }
        }
    },
    /**
     * 格式化银行卡号
     * @param cardNumber
     * @returns {string}
     */
    formatCardNumber: (cardNumber) => {
        if(cardNumber){
            return cardNumber.replace(/....(?!$)/g, '$& ');
        }
        return '';
    },
    formatCardNumberX: (cardNumber) => {
        if(cardNumber){
            let card = cardNumber.match(/^(\d{4}).+(\d{3}$)/);
            return card[1] + ' **** **** **** '+ card[2];
        }
        return '';
    },
    showModal: (title, text) => {
        app.modal({
            title: title || '',
            text: text || ''
        });
        setTimeout(function () {
            app.closeModal();
        }, 1500);
    },
    showTwoBtnModal: (title, callback) => {
        app.modal({
            title: title || '',
            buttons: [
                {
                    text: '取消'
                }, {
                    text: '确定',
                    onClick: () => {
                        callback && callback();
                    }
                }
            ]
        });
    },
    alertMsg: (title, msg, callback) => {
        app.alert(title || '', msg || '', callback);
    },
    //获取指定名称的cookie的值
    getCookie: (cname) => {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for(let i=0; i<ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1);
            if (c.indexOf(name) !== -1) return c.substring(name.length, c.length);
        }
        return "";
    },
    isEmptyObject: (obj) => {
        let name;
        for (name in obj) return false;
        return true;
    },
    /**
     * 数组相关函数
     */
    array: {
        isArray: (param) => {
            return Object.prototype.toString.call(param) === '[object Array]' ? true : false;
        },
        contains: (arr, obj) => {
            var i = arr.length;
            while (i--) {
                if (arr[i] === obj) {
                    return true;
                }
            }
            return false;
        }
    },

    generateUUID: () => {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    },

    router : {
        switchUserApplyStatus: function (data) {
            let userApplyStatus = data.userApplyStatus;
            let userGroup = data.userGroup;
            let appliedProduct = data.appliedProduct;
            utils.tracking.setCommonData('userType',userGroup);
            let pageRouter = {
                page:'u_loginregist',
                unload:false,
                isPDL36:false
            }
            switch (userApplyStatus){
                case 'NEW':
                    let res = this.switchProduct(appliedProduct)
                    pageRouter.page = res.page;
                    pageRouter.unload = res.unload;
                    pageRouter.isPDL36 = res.isPDL36;
                    break;
                case 'PDL380_EXIST':
                    pageRouter.page = '/current';
                    break;
                case 'PDL36_EXIST':
                    pageRouter.page = '/current';
                    pageRouter.isPDL36 = true;
                    break;
                case 'MIL_EXIST':
                    pageRouter.page = API.mil.page.current;
                    pageRouter.unload = true;
                    break;
                default:
                    let res2 = this.switchProduct(appliedProduct);
                    pageRouter.page = res2.page;
                    pageRouter.unload = res2.unload;
                    pageRouter.isPDL36 = res2.isPDL36;
                    break;
            }
            return pageRouter;
        },
        switchProduct: function (data) {
            let pageRouter = {
                page:'/u_loginregist',
                unload:false,
                isPDL36:false
            }
            let length = data.length;
            if(length == 1){
                let product = data[0];
                switch (product){
                    case 'PDL380':
                        pageRouter.page = '/product';
                        break;
                    case 'PDL36':
                        pageRouter.page='/product2';
                        pageRouter.isPDL36 = true;
                        break;
                    case 'MIL_CYCLE':
                        pageRouter.page = API.mil.page.product;
                        pageRouter.unload = true;
                        break;
                    case 'MIL_NEW':
                        pageRouter.page = API.mil.page.product;
                        pageRouter.unload = true;
                        break;
                    default:
                        break;
                }
            }else if(length == 2){
                if(utils.array.contains(data,"PDL380") && utils.array.contains(data,"MIL_CYCLE")){
                    pageRouter.page = '/loan_type';
                }
            }
            return pageRouter;
        },
        switchUserCurrentType:function (data) {
            let applyType = data.applyType;
            let userType = data.userType;
            utils.tracking.setCommonData('userType',userType);
            var pageRouter;
            if(applyType === 'NONE'){
                pageRouter = API.productPageRouter[userType];
            }else{
                pageRouter = API.applyPageRouter[applyType];
            }
            return pageRouter;
        }
    }
}

export default utils;