const Service = require('../baseService');
const moment = require('moment');

class DingdingService extends Service {
    async getToken() {
        const { ctx } = this;
        const corpId = 'ding9b7d0fcba78891b335c2f4657eb6378f';
        const corpSecret = 'rEQAZQhCHIdkiw3zlz8IYVF_I72f-o18KVUTWdTygIA5tmPygyLig_8DiWu7wFRf';
        const param = {
            corpid: corpId,
            corpsecret: corpSecret,
        };
        const url = 'https://oapi.dingtalk.com/gettoken';
        const results = await this.get(url, param);
        return results.access_token;
    }

    async getJSTicket() {
        const { ctx } = this;
        const access_token = await this.getToken();
        const param = {
            access_token,
        };
        const url = 'https://oapi.dingtalk.com/get_jsapi_ticket';
        const results = await this.get(url, param);
        return results.ticket;
    }

    async getAuth() {
        const timestamp = moment().valueOf();
        const nonce =
            moment()
                .unix()
                .toString() + 'asd';
    }

    async getUserFromDing(code) {
        const { ctx } = this;
        const access_token = await this.getToken();
        const param = {
            access_token,
            code,
        };
        const url = 'https://oapi.dingtalk.com/user/getuserinfo';
        const results = await this.get(url, param);
        const user = await ctx.service.user.userService.getUserByDingId(results.userid);
        return user;
    }

    async getAllDepartments(access_token) {
        const { ctx } = this;
        const param = {
            access_token,
            id: 1,
        };
        const url = 'https://oapi.dingtalk.com/department/list';
        const results = await this.get(url, param);
        return results.department;
    }

    async getAllMembers(access_token) {
        const { ctx } = this;
        const departments = await this.getAllDepartments(access_token);
        let allMembers;
        allMembers = [];
        const url = 'https://oapi.dingtalk.com/user/list';
        for (let i = 0; i < departments.length; i++) {
            const param = {
                access_token,
                department_id: departments[i].id,
            };
            const results = await this.get(url, param);
            const members = results.userlist;
            allMembers = allMembers.concat(members);
        }
        const param = {
            access_token,
            department_id: 1,
        };
        const results = await this.get(url, param);
        const members = results.userlist;
        allMembers = allMembers.concat(members);
        return allMembers;
    }

    async syncUsers(access_token) {
        const { ctx } = this;
        const allMembers = await this.getAllMembers(access_token);
        for (let i = 0; i < allMembers.length; i++) {
            const param = {
                nickname: allMembers[i].name,
                permission: this.getPermission(allMembers[i].position),
                dingding_id: allMembers[i].userid,
            };
            const check = await ctx.service.user.userService.getUserByDingId(allMembers[i].userid);
            if (!check) {
                await ctx.service.user.userService.addUser(param);
            } else {
                param.id = check.id;
                await ctx.service.user.userService.updateUser(param);
            }
        }
    }

    getPermission(position) {
        switch (position) {
        case '美工':
            return 0;
        case '生产厂家':
            return 2;
        case '制版厂家':
            return 1;
        case '仓库管理':
            return 4;
        case '经理':
            return 999;
        default:
            return 3;
        }
    }
}

module.exports = DingdingService;
