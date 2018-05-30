const exceptionCode = require('./exceptionCode');

class Exception extends Error {
    constructor(e) {
        super();
        if (e.code) {
            this.msg = e.msg;
            this.code = e.code;
        } else {
            this.msg = exceptionCode.SYSTEM_ERROR.msg;
            this.code = exceptionCode.SYSTEM_ERROR.code;
        }
        this.name = `Error code ${this.code}`;
        this.message = this.msg;
    }
}

module.exports = Exception;
