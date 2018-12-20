const DisconnectMessageDelay = 15 * 1000;

class ConnectionMessages {
    constructor(gameChat) {
        this.gameChat = gameChat;
        this.disconnectedPlayers = new Set();
    }

    printSpectatorJoined(player) {
        this.gameChat.addAlert('info', '{0} has joined the game as a spectator', player);
    }

    printLeft(player) {
        this.gameChat.addAlert('info', '{0} has left the game', player);
    }

    printDisconnected(player) {
        if(player.isSpectator()) {
            this.printImmediateDisconnected(player);
        } else {
            this.printDelayedDisconnected(player);
        }
    }

    printImmediateDisconnected(player) {
        this.gameChat.addAlert('warning', '{0} has disconnected', player);
        this.disconnectedPlayers.add(player);
    }

    printDelayedDisconnected(player) {
        // Delay outputing the disconnect message in case of temporary blips
        // in network connection. This should prevent other players from leaving
        // prematurely during unintentional, temporary disconnects.
        setTimeout(() => {
            if(!player.disconnected) {
                return;
            }

            this.printImmediateDisconnected(player);
        }, DisconnectMessageDelay);
    }

    printReconnected(player) {
        // If the player isn't already marked as disconnected, then don't print
        // the reconnect message. This helps guard against cases where a player
        // reconnects to the server before the disconnect message has been
        // printed.
        if(!player.disconnected || !this.disconnectedPlayers.has(player)) {
            return;
        }

        this.disconnectedPlayers.delete(player);

        this.gameChat.addAlert('info', '{0} has reconnected', player);
    }

    printFailedConnect(player) {
        if(player.isSpectator()) {
            return;
        }

        this.gameChat.addAlert('danger', '{0} has failed to connect to the game', player);
    }
}

module.exports = ConnectionMessages;
