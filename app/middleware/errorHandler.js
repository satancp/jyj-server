const exceptionCode = require('../exception/exceptionCode');
const Exception = require('../exception/exception');

module.exports = () => {
    const handler = async (ctx, next) => {
        try {
            await next();
        } catch (e) {
            console.log(e);
            let result = exceptionCode.SYSTEM_ERROR;
            if (e && e instanceof Exception) {
                if (e.code && e.msg) result = e;
            }
            ctx.body = result;
        }
    };
    return handler;
};
