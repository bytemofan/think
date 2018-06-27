const cookie = {
    get(key){
        let cookies = document.cookie.split(';');
        for(let i = 0; i < cookies.length; i++){
            let cookie = cookies[i].split('=');
            if(key === cookie[0].substring(1)){
                return cookie[1];
            }
        }
        return '';
    },
    set(...arg){
        let date = new Date();
        if(arg.length > 1 && 'string' === typeof arg[0]){
            let expires = arg[2] || 30*24*60*60*1000;
            date.setTime(date.getTime() + expires);
            document.cookie = `${arg[0]}=${arg[1]}; expires=${date.toUTCString()}`;
        }else if(arg.length === 1 && 'object' === typeof arg[0]){
            let expires = 30*24*60*60*1000;
            date.setTime(date.getTime() + expires);
            for(let key in arg[0]){
                document.cookie = `${key}=${arg[0][key]}; expires=${date.toUTCString()}`
            }
        }
    },
    remove(key){
        let date = new Date();
        let value = this.get(key);
        date.setYear('1970');
        document.cookie = `${key}=${value}; expires=${date.toUTCString()}`;
    }
};
export default cookie;