const Controller = require('../baseController');

class UserController extends Controller {
    async getAllUsers() {
        const { ctx } = this;
        const results = await ctx.service.user.userService.getAllUsers();
        this.success(results);
    }

    async getUserByDingId() {
        const { ctx } = this;
        const results = await ctx.service.user.userService.getUserByDingId(ctx.query.id);
        this.success(results);
    }
}

module.exports = UserController;
