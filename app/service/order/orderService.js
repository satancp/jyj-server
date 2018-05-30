const Service = require('../baseService');
const moment = require('moment');

class OrderService extends Service {
    async getAllOrders() {
        const { ctx } = this;
        const results = await ctx.service.order.orderDataService.getAllOrders();
        return results;
    }

    async addOrder(data) {
        const { ctx } = this;
        const results = await ctx.service.order.orderDataService.addOrder(data);
        return results;
    }

    async sendOrder(data) {
        const { ctx } = this;
        const results = await ctx.service.order.orderDataService.sendOrder(data);
        return results;
    }

    async updateUserOrder(data) {
        const { ctx } = this;
        const results = await ctx.service.order.orderDataService.updateUserOrder(data);
        return results;
    }

    async updateOrder(data) {
        const { ctx } = this;
        const results = await ctx.service.order.orderDataService.updateOrder(data);
        return results;
    }

    async confirmAcceptOrder(data) {
        const { ctx } = this;
        const results = await ctx.service.order.orderDataService.confirmAcceptOrder(data);
        return results;
    }

    async uploadToALIOSS(buffer, extName) {
        const { ctx, app } = this;
        const timestamp = moment().valueOf();
        const random = Math.floor((Math.random() + 1) * 10000);
        const finalName = random + timestamp + extName;
        const object = await ctx.oss.put('orders/' + finalName, buffer);
        if (object) return object.url;
    }
}

module.exports = OrderService;
