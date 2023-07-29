const GameActions = require('../../GameActions/index.js');
const PlotCard = require('../../plotcard.js');
const {ChallengeTracker} = require('../../EventTrackers');

class RobertsRebellion extends PlotCard {
    setupCardAbilities() {
        this.tracker = ChallengeTracker.forRound(this.game);

        this.forcedInterrupt({
            when: {
                onPhaseEnded: event => event.phase === 'challenge' && this.tracker.some({ loser: this.controller, challengeType: 'power' })
            },
            message: {
                format: '{player} is forced to discard {amount} power from their faction card for {source}',
                args: { amount: context => this.getPowerAmount(context) }
            },
            gameAction: GameActions.discardPower(context => ({ card: context.player.faction, amount: this.getPowerAmount(context) }))
        });
    }

    getPowerAmount(context) {
        return Math.min(context.player.faction.power, 3);
    }
}

RobertsRebellion.code = '25512';
RobertsRebellion.version = '1.0';

module.exports = RobertsRebellion;
