const ip = require('ip');

module.exports = appInfo => {
    const localIP = ip.address();
    const domainWhiteList = [];
    [ 80, 3000, 7000, 7001, 9000, 9001, 9002, 9999 ].forEach(port => {
        domainWhiteList.push(`http://localhost:${port}`);
        domainWhiteList.push(`http://127.0.0.1:${port}`);
        domainWhiteList.push(`http://${localIP}:${port}`);
        domainWhiteList.push(`http://dashboard.goland.cool:${port}`);
        domainWhiteList.push(`http://192.168.2.5/:${port}`);
    });
    return (exports = {
        keys: appInfo.name + '_1526994623888_9620',
        middleware: [ 'errorHandler' ],
        mysql: {
            client: {
                host: 'localhost',
                port: '3306',
                user: 'root',
                password: 'wsxjw113',
                database: 'jyj',
            },
            app: true,
            agent: false,
        },
        security: {
            domainWhiteList,
            csrf: {
                enable: false,
            },
        },
        cors: {
            origin: '*',
            allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
        },
        oss: {
            client: {
                accessKeyId: 'LTAIzlfBYGYqrS1h',
                accessKeySecret: 'JgSlg5pdLAZt1nWc0rJX5pAErAZLFY',
                bucket: 'jyj-web',
                endpoint: 'oss-cn-hangzhou.aliyuncs.com',
                timeout: '60s',
            },
        },
    });
};
