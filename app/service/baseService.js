const { Service } = require('egg');
const request = require('request');

class BaseService extends Service {
    get(url, param) {
        return new Promise((resolve, reject) => {
            let paramString = '';
            const keys = Object.keys(param);
            for (let i = 0; i < keys.length; i++) {
                paramString = paramString + '&' + keys[i] + '=' + param[keys[i]];
            }
            if (paramString.length > 0) {
                paramString = paramString.substring(1);
            }
            request(`${url}?${paramString}`, (error, response, body) => {
                if (error) reject(error);
                resolve(JSON.parse(body));
            });
        });
    }
}

module.exports = BaseService;
