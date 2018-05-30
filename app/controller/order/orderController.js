const Controller = require('../baseController');
const sendToWormhole = require('stream-wormhole');
const toArray = require('stream-to-array');

class OrderController extends Controller {
    async getAllOrders() {
        const { ctx } = this;
        const results = await ctx.service.order.orderService.getAllOrders();
        this.success(results);
    }

    async addOrder() {
        const { ctx } = this;
        const results = await ctx.service.order.orderService.addOrder(ctx.request.body);
        this.success(results);
    }

    async sendOrder() {
        const { ctx } = this;
        const results = await ctx.service.order.orderService.sendOrder(ctx.request.body);
        this.success(results);
    }

    async updateUserOrder() {
        const { ctx } = this;
        const results = await ctx.service.order.orderService.updateUserOrder(ctx.request.body);
        this.success(results);
    }

    async updateOrder() {
        const { ctx } = this;
        const results = await ctx.service.order.orderService.updateOrder(ctx.request.body);
        this.success(results);
    }

    async confirmAcceptOrder() {
        const { ctx } = this;
        const results = await ctx.service.order.orderService.confirmAcceptOrder(ctx.request.body);
        this.success(results);
    }

    async upload() {
        const { ctx } = this;
        const stream = await ctx.getFileStream();
        const filename = stream.filename;
        let extName = '';
        if (filename.indexOf('.') > -1) extName = filename.substring(filename.indexOf('.'));
        const parts = await toArray(stream);
        const buffer = Buffer.concat(parts);
        let result;
        try {
            result = await ctx.service.order.orderService.uploadToALIOSS(buffer, extName);
        } catch (err) {
            await sendToWormhole(stream);
            throw err;
        }
        this.success(result);
    }
}

module.exports = OrderController;
