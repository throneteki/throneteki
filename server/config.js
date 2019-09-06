var config = {
    secret: 'somethingverysecret',
    hmacSecret: 'somethingsupersecret',
    dbPath: 'mongodb://127.0.0.1:27017/throneteki',
    mqUrl: 'tcp://127.0.0.1:6000' // This is the host/port of the Zero MQ server which does the node load balancing
};

module.exports = config;
