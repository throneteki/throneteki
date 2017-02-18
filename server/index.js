const Server = require('./server.js');
const Lobby = require('./lobby.js');

function runServer() {
    var server = new Server(process.env.NODE_ENV !== 'production');
    var httpServer = server.init();
    new Lobby(httpServer);

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

// io.on('connection', function(socket) {
    // if(socket.request.user) {
    //     var game = findGameForPlayer(socket.request.user.username);

    //     if(game) {
    //         runAndCatchErrors(game, () => {
    //             if(!game.playersAndSpectators[socket.request.user.username].left) {
    //                 socket.join(game.id);

    //                 game.reconnect(socket.id, socket.request.user.username);

    //                 sendGameState(game);
    //             }
    //         });
    //     }
    // }
// });

module.exports = runServer;
