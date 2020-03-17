import OTP from 'otp';
import parser from 'otpauth-uri-parser';

const IS_DEMO = false;

export const getData = (url) => {
    return parser(url);
};

export const getCode = (obj) => {
    const otp = OTP({
        name: "123",
        secret: obj.query && obj.query.secret
    });

    return !IS_DEMO ? otp.totp() : "000000";
};

export const generateId = (issuer, account) => {
    let result = Buffer.from(issuer + ":" + account).toString("base64");
    result = result.split("+").join("-");
    result = result.split("/").join("_");
    result = result.replace(/=+$/, '');
    return result;
};

