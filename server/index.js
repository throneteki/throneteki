const Server = require('./server.js');
const Lobby = require('./lobby.js');
const pmx = require('pmx');
const monk = require('monk');
const logger = require('./log.js');
const ServiceFactory = require('./services/ServiceFactory.js');

let configService = ServiceFactory.configService();

async function runServer() {
    let options = {
        instance: configService.getValue('instance') || {}
    };

    await monk(configService.getValue('dbPath'))
        .then((db) => {
            options.db = db;
        })
        .catch((err) => {
            throw err;
        });

    let server = new Server(process.env.NODE_ENV !== 'production');
    let httpServer = server.init(options);
    let lobby = new Lobby(httpServer, options);

    pmx.action('status', (reply) => {
        var status = lobby.getStatus();

        reply(status);
    });

    pmx.action('disable', (param, reply) => {
        if (!param) {
            reply({ error: 'Need to specify node to disable' });

            return;
        }

        reply({ success: lobby.disableNode(param) });
    });

    pmx.action('enable', (param, reply) => {
        if (!param) {
            reply({ error: 'Need to specify node to enable' });

            return;
        }

        reply({ success: lobby.enableNode(param) });
    });

    pmx.action('debug', (reply) => {
        reply(lobby.debugDump());
    });

    server.run();
}

module.exports = runServer;
