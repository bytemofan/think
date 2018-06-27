const wxShare = {
    init(opt){
        this.shareInfo = opt.shareInfo;
        this.shareSuccess = opt.shareSucc;
        this.shareFail = opt.shareFail;
    },
    timeline(shareInfo){
        if(typeof wx !== 'undefined'){
            wx.onMenuShareTimeline({
                title: shareInfo.desc, // 分享标题
                link: shareInfo.link, // 分享链接
                imgUrl: shareInfo.imgUrl, // 分享图标
                success: this.shareSuccess,
                cancel: this.shareFail
            });
        }
    },
    appMessage(shareInfo){
        if(typeof wx !== 'undefined'){
            wx.onMenuShareAppMessage({
                title: shareInfo.title, // 分享标题
                desc: shareInfo.desc, // 分享描述
                link: shareInfo.link, // 分享链接
                imgUrl: shareInfo.imgUrl, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: this.shareSuccess,
                cancel: this.shareFail
            });
        }
    },
    QQ(shareInfo){
        if(typeof wx !== 'undefined'){
            wx.onMenuShareQQ({
                title: shareInfo.title, // 分享标题
                desc: shareInfo.desc, // 分享描述
                link: shareInfo.link, // 分享链接
                imgUrl: shareInfo.imgUrl, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: this.shareSuccess,
                cancel: this.shareFail
            });
        }
    },
    QZone(shareInfo){
        if(typeof wx !== 'undefined'){
            wx.onMenuShareQZone({
                title: shareInfo.title, // 分享标题
                desc: shareInfo.desc, // 分享描述
                link: shareInfo.link, // 分享链接
                imgUrl: shareInfo.imgUrl, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: this.shareSuccess,
                cancel: this.shareFail
            });
        }
    },
    weibo(shareInfo){
        if(typeof wx !== 'undefined') {
            wx.onMenuShareWeibo({
                title: shareInfo.title, // 分享标题
                desc: shareInfo.desc, // 分享描述
                link: shareInfo.link, // 分享链接
                imgUrl: shareInfo.imgUrl, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: this.shareSuccess,
                cancel: this.shareFail
            });
        }
    },
    create(shareInfo, success, fail){
        shareInfo = shareInfo || this.shareInfo;
        this.shareSuccess = success;
        this.shareFail = fail;
        this.timeline(shareInfo);
        this.appMessage(shareInfo);
        this.QQ(shareInfo);
        this.QZone(shareInfo);
        this.weibo(shareInfo);
    }
};

export default wxShare;