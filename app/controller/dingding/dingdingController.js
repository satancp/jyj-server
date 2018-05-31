const Controller = require('../baseController');

class DingdingController extends Controller {
    async getUserFromDing() {
        const { ctx } = this;
        const results = await ctx.service.dingding.dingdingService.getUserFromDing(ctx.query.code);
        this.success(results);
    }

    async getAuth() {
        const { ctx } = this;
        const results = await ctx.service.dingding.dingdingService.getAuth();
        this.success(results);
    }
}

module.exports = DingdingController;
