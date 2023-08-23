const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');
const GenericTracker = require('../../EventTrackers/GenericTracker');

class PinkGraces extends DrawCard {
    setupCardAbilities() {
        this.tracker = GenericTracker.forPhase(this.game, 'onClaimApplied');

        this.interrupt({
            when: {
                onPhaseEnded: event => event.phase === 'challenge'
            },
            message: '{player} uses {source} to allow each player who did not apply military claim this phase to draw 1 card',
            gameAction: GameActions.simultaneously(context => 
                context.game.getPlayersInFirstPlayerOrder().filter(player => !this.hasAppliedMilitaryClaim(player)).map(player =>
                    GameActions.may({
                        player,
                        title: 'Draw 1 card from ' + this.name + '?',
                        message: {
                            format: '{choosingPlayer} {gameAction}',
                            args: { choosingPlayer: () => player }
                        },
                        gameAction: GameActions.drawCards({ player, amount: 1, source: this })
                    })
                )
            )
        });
    }

    hasAppliedMilitaryClaim(player) {
        return this.tracker.some(event => event.player === player && event.challenge.challengeType === 'military');
    }
}

PinkGraces.code = '25578';
PinkGraces.version = '1.1';

module.exports = PinkGraces;
