export default function decodeString(str) {
    let unitRegex = /(\d?)(\[[a-z]+\])/g;
    if(!str.match(unitRegex)) return str;
    str = str.replace(unitRegex, function (match, p1, p2) {
        let s = '';
        if(!p1) p1 = 1;
        if(/\d/.test(p1)){
            for(let i = 0; i < parseInt(p1); i++ ){
                p2 = p2.replace('[','').replace(']','');
                s += p2;
            }
        }
        return s;
    });
    return decodeString(str);
}