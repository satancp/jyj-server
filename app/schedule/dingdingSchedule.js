const Subscription = require('egg').Subscription;

class DingdingSchedule extends Subscription {
    static get schedule() {
        return {
            interval: 1000 * 60 * 60 * 24 * 7,
            type: 'worker',
            immediate: true,
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        const { ctx } = this;
        const access_token = await ctx.service.dingding.dingdingService.getToken();
        await ctx.service.dingding.dingdingService.syncUsers(access_token);
    }
}

module.exports = DingdingSchedule;
