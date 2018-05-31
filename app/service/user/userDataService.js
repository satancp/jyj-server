const Service = require('../baseService');
const moment = require('moment');
const Exception = require('../../exception/exception');
const {} = require('../../exception/exceptionCode');

class UserDataService extends Service {
    async getAllUsers() {
        const { app } = this;
        const results = await app.mysql.select('t_user', {
            where: { is_delete: 0 },
            orders: [[ 'id', 'desc' ]],
        });
        return results;
    }

    async getUserByDingId(id) {
        const { app } = this;
        const results = await app.mysql.select('t_user', {
            where: { dingding_id: id },
        });
        if (results.length === 0) return undefined;
        return results[0];
    }

    async addUser(data) {
        const { app } = this;
        const results = await app.mysql.insert('t_user', {
            nickname: data.nickname,
            permission: data.permission,
            dingding_id: data.dingding_id,
        });
        return results;
    }

    async updateUser(data) {
        const { app } = this;
        const results = await app.mysql.update('t_user', {
            id: data.id,
            nickname: data.nickname,
            permission: data.permission,
            dingding_id: data.dingding_id,
        });
        return results;
    }
}

module.exports = UserDataService;
