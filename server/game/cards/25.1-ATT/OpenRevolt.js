const ChallengeTracker = require('../../EventTrackers/ChallengeTracker');
const GameActions = require('../../GameActions');
const PlotCard = require('../../plotcard');

class OpenRevolt extends PlotCard {
    setupCardAbilities() {
        this.tracker = ChallengeTracker.forPhase(this.game);

        const amountToGain = context => context.player.outOfGamePile.filter(card => card.isMatch({ type: 'plot', trait: 'Scheme' })).length >= 3 ? 4 : 2;
        this.interrupt({
            when: {
                onPhaseEnded: event => event.phase === 'challenge' && this.tracker.count({ challengeType: 'intrigue', loser: this.controller }) === 0
            },
            message: {
                format: '{player} uses {source} to gain {amount} power',
                args: { amount: amountToGain }
            },
            gameAction: GameActions.gainPower(context => ({
                amount: amountToGain(context),
                card: context.player.faction
            }))
        });
    }
}

OpenRevolt.code = '25020';

module.exports = OpenRevolt;
