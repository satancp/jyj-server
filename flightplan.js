const plan = require('flightplan');

const appName = 'jyj';
const username = 'root';
const startFile = 'yarn --name \'jyj-api\' -- start';
const privateKey = '/Users/Chris/.ssh/jyj_web.pem';
const tmpDir = appName + '-' + new Date().getTime();

// configuration
plan.target('prod', [
    {
        host: '47.97.192.48',
        username,
        privateKey,
        agent: process.env.SSH_AUTH_SOCK,
        env: 'prod',
    },
]);

const versionDir = appName + '-versions/';
const folderDir = versionDir + tmpDir;

plan.local(function(local) {
    // uncomment these if you need to run a build on your machine first
    // local.log('Run build');

    local.log('Copy files to remote hosts');
    const filesToCopy = local.exec('git ls-files', { silent: true });
    // rsync files to all the destination's hosts
    local.transfer(filesToCopy, '/tmp/' + tmpDir);
});

// run commands on remote hosts (destinations)
plan.remote(function(remote) {
    remote.log('Move folder to root');
    remote.sudo('cp -R /tmp/' + tmpDir + ' ~', { user: username });
    remote.rm('-rf /tmp/' + tmpDir);
    remote.log('Install dependencies');
    remote.sudo('cd ~/' + tmpDir + ' && yarn', { user: username });

    remote.log('Reload application');
    remote.sudo('ln -snf ~/' + tmpDir + ' ~/' + appName, { user: username });

    // remote.log('Build js files');
    // remote.sudo('cd ~/' + tmpDir + ' && yarn build && mkdir upload', { user: username });
    // remote.log('Cleaning up old deploys...');
    // remote.sudo('rm -rf `ls -1dt ~/' + appName + '-* | tail -n 1`', { user: username });
    remote.log('PM2 delete all app');
    remote.exec('pm2 delete all');
    remote.log('PM2 start app ~/' + appName + '/' + startFile);
    remote.exec('cd ~/' + appName + ' && pm2 start ' + startFile);
    remote.log('PM2 list all');
    remote.exec('pm2 ls');
});
