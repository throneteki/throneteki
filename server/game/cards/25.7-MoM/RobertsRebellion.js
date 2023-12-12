const GameActions = require('../../GameActions/index.js');
const PlotCard = require('../../plotcard.js');
const {ChallengeTracker} = require('../../EventTrackers');

class RobertsRebellion extends PlotCard {
    setupCardAbilities() {
        this.tracker = ChallengeTracker.forRound(this.game);

        this.forcedInterrupt({
            when: {
                onPhaseEnded: event => event.phase === 'challenge'
            },
            message: {
                format: '{players} are forced to discard 2 power from their faction card for {source}, if able',
                args: { players: () => this.getLosingPlayers() }
            },
            gameAction: GameActions.simultaneously(
                this.getLosingPlayers().map(player => GameActions.discardPower({ card: player.faction, amount: this.getPowerAmount(player) })) 
            )
        });
    }

    getLosingPlayers() {
        return [...new Set(this.tracker.filter({ challengeType: 'power', match: challenge => challenge.loser }).map(challenge => challenge.loser))];
    }

    getPowerAmount(player) {
        return Math.min(player.faction.power, 2);
    }
}

RobertsRebellion.code = '25512';
RobertsRebellion.version = '1.1';

module.exports = RobertsRebellion;
