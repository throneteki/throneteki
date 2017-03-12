const Server = require('./server.js');
const Lobby = require('./lobby.js');
const pmx = require('pmx');

function runServer() {
    var server = new Server(process.env.NODE_ENV !== 'production');
    var httpServer = server.init();
    var lobby = new Lobby(httpServer);

    pmx.action('status', reply => {
        var status = lobby.getStatus();

        reply(status);
    });

    pmx.action('disable', (param, reply) => {
        if(!param) {
            reply({error: 'Need to specify node to disable'});

            return;
        }

        reply({ success: lobby.disableNode(param) });
    });

    pmx.action('enable', (param, reply) => {
        if(!param) {
            reply({error: 'Need to specify node to enable'});

            return;
        }

        reply({ success: lobby.enableNode(param) });
    });

    server.run();
}

// function handleError(game, e) {
//     logger.error(e);

//     var debugData = {};

//     debugData.game = game.getState();

//     _.each(game.getPlayers(), player => {
//         debugData[player.name] = player.getState(player.name);
//     });

//     if(!isDeveloping) {
//         ravenClient.captureException(e, { extra: debugData });
//     }

//     if(game) {
//         game.addMessage('A Server error has occured processing your game state, apologies.  Your game may now be in an inconsistent state, or you may be able to continue.  The error has been logged.');
//     }
// }

// function runAndCatchErrors(game, func) {
//     try {
//         func();
//     } catch(e) {
//         handleError(game, e);

//         sendGameState(game);
//     }
// }

module.exports = runServer;
