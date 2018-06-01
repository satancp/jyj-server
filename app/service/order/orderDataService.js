const Service = require('../baseService');
const moment = require('moment');
const Exception = require('../../exception/exception');
const {
    DUPLICATE_ORDER_ERROR,
    USER_ORDER_OVERFLOW_ERROR,
    ORDER_HAS_BEEN_SENT_ERROR,
    USER_NOT_EXIST_ERROR,
} = require('../../exception/exceptionCode');

class OrderDataService extends Service {
    async getAllOrders() {
        const { app } = this;
        const results = await app.mysql.select('t_order', {
            where: { is_delete: 0 },
            orders: [[ 'created_at', 'desc' ], [ 'id', 'desc' ]],
        });
        for (let i = 0; i < results.length; i++) {
            if (results[i].status >= 1) {
                const order = await app.mysql.select('t_user_order', {
                    where: { order_id: results[i].id },
                });
                for (let a = 0; a < order.length; a++) {
                    const user = await app.mysql.select('t_user', { where: { id: order[a].user_id } });
                    if (order[a].user_type === 0) {
                        results[i].receiver_id = user[0].id;
                        results[i].receiver_name = user[0].nickname;
                    } else if (order[a].user_type === 1) {
                        results[i].boarder_id = user[0].id;
                        results[i].boarder_name = user[0].nickname;
                    } else if (order[a].user_type === 2) {
                        results[i].producer_id = user[0].id;
                        results[i].producer_name = user[0].nickname;
                    }
                }
            }
        }
        return results;
    }

    async addOrder(data) {
        const { app } = this;
        const query = {
            created_at: new Date(),
            updated_at: new Date(),
            status: 0,
            is_delete: 0,
            board_price: 0,
            custom_type: data.custom_type,
            est_time: moment(data.est_time, moment.ISO_8601).toDate(),
            contact_phone: data.contact_phone,
            client: data.client,
            image_shortcut: data.image_shortcut,
            double_size: data.double_size,
            number: data.number,
            print_info: data.print_info,
            include_hand_size: data.include_hand_size,
            print_color: data.print_color,
            figure: data.figure,
            delivery: data.delivery,
            background_color: data.background_color,
            client_confirm: data.client_confirm,
            address: data.address,
            special: data.special,
        };
        const check = await app.mysql.select('t_order', {
            where: { is_delete: false, custom_type: data.custom_type },
        });
        if (check.length > 0) throw new Exception(DUPLICATE_ORDER_ERROR);
        const results = await app.mysql.insert('t_order', query);
        return results;
    }

    async updateOrder(data) {
        const { app } = this;
        const query = {
            updated_at: new Date(),
            id: data.id,
        };
        if (data.status) query.status = data.status;
        if (data.board_price) query.board_price = data.board_price;
        if (data.image_url) query.image_url = data.image_url;
        if (data.contact_phone) query.contact_phone = data.contact_phone;
        if (data.client) query.client = data.client;
        if (data.image_shortcut) query.image_shortcut = data.image_shortcut;
        if (data.double_size) query.double_size = data.double_size;
        if (data.number) query.number = data.number;
        if (data.print_info) query.print_info = data.print_info;
        if (data.include_hand_size) query.include_hand_size = data.include_hand_size;
        if (data.print_color) query.print_color = data.image_uprint_colorrl;
        if (data.figure) query.figure = data.figure;
        if (data.delivery) query.delivery = data.delivery;
        if (data.background_color) query.background_color = data.background_color;
        if (data.client_confirm) query.client_confirm = data.client_confirm;
        if (data.address) query.address = data.address;
        if (data.special) query.special = data.special;
        const results = await app.mysql.beginTransactionScope(async conn => {
            if (data.status === 6) {
                await conn.update(
                    't_user_order',
                    { status: 2, updated_at: new Date() },
                    {
                        where: {
                            user_type: 2,
                            order_id: data.id,
                        },
                    }
                );
            }
            const results = await app.mysql.update('t_order', query);
            return results;
        });
        return results;
    }

    async sendOrder(data) {
        const { app } = this;
        const query = {
            created_at: new Date(),
            updated_at: new Date(),
            status: 0,
            user_id: data.user_id,
            order_id: data.order_id,
        };
        const checkUser = await app.mysql.select('t_user_order', {
            where: { status: 0, user_id: data.user_id },
        });
        if (checkUser.length > 10) throw new Exception(USER_ORDER_OVERFLOW_ERROR);
        const checkOrder = await app.mysql.select('t_user_order', {
            where: { status: 0, order_id: data.order_id },
        });
        if (checkOrder.length > 0) throw new Exception(ORDER_HAS_BEEN_SENT_ERROR);
        const user = await app.mysql.select('t_user', { where: { id: data.user_id, is_delete: 0 } });
        if (user.length === 0) throw new Exception(USER_NOT_EXIST_ERROR);
        query.user_type = user[0].permission;
        const results = await app.mysql.beginTransactionScope(async conn => {
            const orderQuery = {
                id: data.order_id,
                status: 0,
            };
            if (query.user_type === 0) {
                query.status = 2;
                orderQuery.status = 1;
            } else if (query.user_type === 1) {
                query.status = 2;
                orderQuery.status = 3;
            } else if (query.user_type === 2) {
                orderQuery.status = 3;
            }
            if (data.board_price) orderQuery.board_price = data.board_price;
            const result = await conn.insert('t_user_order', query);
            await app.mysql.update('t_order', orderQuery);
            return result;
        });
        return results;
    }

    async updateUserOrder(data) {
        const { app } = this;
        const query = {
            updated_at: new Date(),
            status: data.status,
        };
        const results = await app.mysql.update('t_user_order', query, {
            where: {
                user_id: data.user_id,
                order_id: data.order_id,
            },
        });
        return results;
    }

    async confirmAcceptOrder(data) {
        const { app } = this;
        const query = {
            updated_at: new Date(),
            status: 1,
            order_id: data.order_id,
            user_id: data.user_id,
        };
        const results = await app.mysql.beginTransactionScope(async conn => {
            const orderQuery = {
                id: data.order_id,
                status: 4,
            };
            const result = await conn.update('t_user_order', query, {
                where: {
                    user_id: data.user_id,
                    order_id: data.order_id,
                },
            });
            await app.mysql.update('t_order', orderQuery);
            return result;
        });
        return results;
    }
}

module.exports = OrderDataService;
