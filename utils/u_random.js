let random = {
    string: (length) => {
        let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        let string_length = length;
        let randomstring = '';
        for (let i=0; i<string_length; i++) {
            let rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum,rnum+1);
        }
        return randomstring;
    },
    number: (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
module.exports = random;