import pmx from 'pmx';
import GameServer from './gameserver.js';

var server = new GameServer();

pmx.action('debug', (reply) => {
    reply(server.debugDump());
});
