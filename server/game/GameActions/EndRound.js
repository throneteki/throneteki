import GameAction from './GameAction.js';

class EndRound extends GameAction {
    constructor() {
        super('endRound');
    }

    canChangeGameState({ game }) {
        return game.currentPhase !== 'setup';
    }

    createEvent({ game }) {
        return this.event('onRoundEnded', { game }, (event) => {
            event.game.addAlert('endofround', 'End of round {0}', event.game.round);

            const playerPower = event.game
                .getPlayers()
                .sort((a, b) => a.getTotalPower() - b.getTotalPower())
                .map((player) => `${player.name}: ${player.getTotalPower()}`)
                .join(', ');

            event.game.addMessage(playerPower);

            event.thenAttachEvent(this.event('onAtEndOfRound', { game: event.game }));
        });
    }
}

export default new EndRound();
