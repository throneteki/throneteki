import moment from 'moment';
import WaitForPlayerPrompt from './WaitForPlayerPrompt.js';
import TextHelper from '../TextHelper.js';

/**
 * Handles the disconnection & reconnection logic for all in-game players (not spectators).
 *
 * Logic for handling a disconnected player is slightly different for each game format:
 * - Joust: Players will have X seconds to reconnect. Following that, the opponent can leave without penalty, resulting in a concluded game with no winner.
 * - Melee: Players will have X seconds to reconnect. Following that, opponents will vote to wait an additional X seconds, or eliminate them.
 *          Eliminations must be a unanimous vote, and re-votes keep happening until they reconnect or are voted for elimination.
 *
 * X is configurable, but defaulted to 30 seconds
 */
class DisconnectHandler {
    constructor(game, waitSeconds = 30) {
        this.game = game;
        this.waitSeconds = waitSeconds;

        this.disconnections = {};
    }

    /** Checks if player is currently disconnected */
    isDisconnected(player) {
        return !!this.disconnections[player.name];
    }

    /** Checks if player is has been disconnected longer than the allocated wait period (default 30 seconds) */
    isLongDisconnected(player) {
        return this.disconnections[player.name]?.longDisconnected || false;
    }

    waitForReconnect(player, handler = () => true) {
        if (!this.isDisconnected(player)) {
            return;
        }
        const timer = setTimeout(() => {
            handler(player);
            clearTimeout(timer);
            this.game.sendGameState();
        }, this.waitSeconds * 1000);
        this.disconnections[player.name].timer = timer;
    }

    /** Marks a player as disconnected, alerting as such and tracking if they do not reconnect beyond wait period (default 30 seconds) */
    disconnected(player) {
        if (this.isDisconnected(player)) {
            return;
        }
        if (this.game.isGameOver && !this.game.isPostGameOver) {
            // No need to wait for them to reconnect for complete game, just alert other players they disconnected
            this.game.addAlert('warning', '{0} has disconnected', player);
            return;
        }
        this.game.addAlert(
            'warning',
            '{0} has disconnected. The game will wait up to {1} for them to reconnect',
            player,
            TextHelper.duration(this.waitSeconds)
        );
        const playerData = {
            disconnectedAt: new Date(),
            reason: 'disconnected'
        };
        this.disconnections[player.name] = playerData;

        const initialWaitedFunc = (player) => {
            // Mark as a long disconnection
            this.disconnections[player.name].longDisconnected = true;

            if (this.game.isJoust) {
                this.game.addAlert(
                    'warning',
                    '{0} has been disconnected for more than {1}. You can continue to wait or can leave the game and it will conclude with no winner',
                    player,
                    TextHelper.duration(this.waitSeconds)
                );
            } else if (this.game.isMelee) {
                this.voteToEliminate(player, true);
            }
        };
        this.waitForReconnect(player, initialWaitedFunc);
    }

    voteToEliminate(player, initial = false) {
        if (!this.isDisconnected(player)) {
            return;
        }

        const disconnectedSeconds = () => {
            if (initial) {
                return this.waitSeconds;
            }
            const disconnectedAt = this.disconnections[player.name].disconnectedAt;
            const duration = moment.duration(moment().diff(moment(disconnectedAt)));
            return duration.asSeconds();
        };

        const votingPlayers = this.game
            .getPlayers()
            .filter((player) => !this.game.isDisconnected(player));
        this.game.addAlert(
            'warning',
            votingPlayers.length > 1
                ? '{0} has been disconnected for more than {1}. Remaining players may vote to wait an additional {2} for them to reconnect or eliminate them (must be unanimous)'
                : `{0} as been disconnected for more than {1}. {3} may choose to wait an additional {2} for them to reconnect, eliminate them. They may also leave at any time to conclude with no winner`,
            player,
            TextHelper.duration(disconnectedSeconds()),
            TextHelper.duration(this.waitSeconds),
            votingPlayers[0]
        );
        const waitFunc = () => {
            this.game.addAlert(
                'info',
                'Waiting an additional {0} for {1} to reconnect',
                TextHelper.duration(this.waitSeconds),
                player
            );
            this.waitForReconnect(player, (player) => this.voteToEliminate(player));
        };
        this.game.queueStep(new WaitForPlayerPrompt(this.game, player, waitFunc));
        this.game.continue();
    }

    /** Marks a player as to have been failed to connect to the game to begin with */
    failedConnection(player) {
        if (this.isDisconnected(player)) {
            return;
        }
        this.game.addAlert('danger', '{0} has failed to connect to the game node', player);
        this.disconnected(player);
    }

    /** Marks a disconnected player as reconnected */
    reconnected(player) {
        if (!this.isDisconnected(player)) {
            return;
        }
        this.game.addAlert('info', '{0} has reconnected', player);
        // Clears the timer, if they have one (can be undefined)
        clearTimeout(this.disconnections[player.name].timer);
        delete this.disconnections[player.name];
    }

    /** Whether a player is in a state where they must wait for an opponent to reconnect, mostly for checking if they can safely leave the game */
    mustWaitForReconnections(player) {
        return !this.game
            .getOpponents(player)
            .every((opponent) => this.isLongDisconnected(opponent));
    }
}

export default DisconnectHandler;
