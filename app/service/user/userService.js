const Service = require('../baseService');

class UserService extends Service {
    async getAllUsers() {
        const { ctx } = this;
        const results = await ctx.service.user.userDataService.getAllUsers();
        return results;
    }

    async getUserByDingId(id) {
        const { ctx } = this;
        const results = await ctx.service.user.userDataService.getUserByDingId(id);
        return results;
    }

    async addUser(data) {
        const { ctx } = this;
        const results = await ctx.service.user.userDataService.addUser(data);
        return results;
    }
}

module.exports = UserService;
