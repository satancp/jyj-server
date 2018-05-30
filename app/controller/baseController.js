const { Controller } = require('egg');

class BaseController extends Controller {
    success(data) {
        const res = {
            code: 0,
            msg: 'OK',
            data,
        };
        this.ctx.body = res;
    }
}

module.exports = BaseController;
