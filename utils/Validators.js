import Formsy from 'formsy-react';

function singleton() {
    const  isValidCardNumber = function(values, value) {
        let bEven, cDigit, i, j, nCheck, nDigit, ref;
        if (/[^0-9-\s]+/.test(value)) {
            return false;
        } else {
            nCheck = 0;
            nDigit = 0;
            bEven = false;
            value = value.replace(/\D/g, "");
            for (i = j = ref = value.length - 1; ref <= 0 ? j <= 0 : j >= 0; i = ref <= 0 ? ++j : --j) {
                cDigit = value.charAt(i);
                nDigit = parseInt(cDigit, 10);
                if (bEven && (nDigit *= 2) > 9) {
                    nDigit -= 9;
                }
                nCheck += nDigit;
                bEven = !bEven;
            }
            return (nCheck % 10) === 0;
        }
    };
    const isNotBlankString = function(values, value) {
        let re, regu;
        if (value === "") {
            false;
        }
        regu = "^[ ]+$";
        re = new RegExp(regu);
        if (re.test(value)) {
            return false;
        } else {
            return true;
        }
    };
    Formsy.addValidationRule('isValidCard', isValidCardNumber);
    Formsy.addValidationRule('isNotBlank', isNotBlankString);
    return {
        mobilePhone: {
            matchRegexp: new RegExp('^(133|153|180|181|189|177|130|131|132|155|156|185|186|176|134|135|136|137|138|139|147|150|151|152|170|158|159|182|183|184|157|145|187|188|178|175)[\\d]{8}$')
        },
        chineseName: {
            minLength: 2,
            maxLength: 10,
            matchRegexp: /^[\u4E00-\u9FFF\u3400-\u4DFF]+$/
        },
        identityId: {
            isLength: 18,
            isExisty:true
        },
        phoneNumber: {
            isNumeric: true,
            minLength: 8,
            maxLength: 12
        },
        cardNumber: {
            isNumeric: true,
            minLength: 13,
            isValidCard: true
        },
        password: {
            minLength: 6,
            maxLength: 128
        },
        email: {
            isEmail: true,
            maxLength: 80
        },
        address: {
            isNotBlank: true,
            minLength: 5,
            maxLength: 50
        },
        ispPassword: {
            isNumeric: true,
            isNotBlank: true,
            minLength: 6,
            // matchRegexp: /^\d{6}(\d{2})?$/ 固定位数6位或8位
        }
    };
};

export default singleton();
