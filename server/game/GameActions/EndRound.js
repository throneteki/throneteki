import GameAction from './GameAction.js';

class EndRound extends GameAction {
    constructor() {
        super('endRound');
    }

    canChangeGameState({ game }) {
        return game.currentPhase !== 'setup';
    }

    createEvent({ game }) {
        game.beginEndingDuration('untilEndOfRound');
        return this.event('onRoundEnded', { game }, (event) => {
            event.game.effectEngine.unapplyAndRemove(
                (effect) => effect.duration === 'untilEndOfRound'
            );
            event.game.effectEngine.expireDelayedEffects('untilEndOfRound');
            event.game.addAlert('endofround', 'End of round {0}', event.game.round);

            const playersInPowerOrder = event.game
                .getPlayers()
                .sort((a, b) => b.getTotalPower() - a.getTotalPower());

            for (const player of playersInPowerOrder) {
                event.game.addMessage('{0} has {1} total power', player, player.getTotalPower());
            }

            event.thenAttachEvent(this.event('onAtEndOfRound', { game: event.game }));
        });
    }
}

export default new EndRound();
