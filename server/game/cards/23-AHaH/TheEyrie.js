const DrawCard = require('../../drawcard');
const {ChallengeTracker} = require('../../EventTrackers');

class TheEyrie extends DrawCard {
    setupCardAbilities(ability) {
        this.challengeTracker = ChallengeTracker.forPhase(this.game);

        this.plotModifiers({
            initiative: -2,
            reserve: 1
        });

        this.persistentEffect({
            condition: () => !this.kneeled,
            targetController: 'opponent',
            match: opponent => (
                opponent.getTotalPower() > this.controller.getTotalPower() &&
                this.challengeTracker.count({ initiatingPlayer: opponent, initiatedAgainstPlayer: this.controller }) >= 2
            ),
            effect: ability.effects.cannotInitiateChallengeType('any', opponent => opponent === this.controller)
        });

        this.reaction({
            when: {
                onPhaseStarted: event => event.phase === 'challenge'
            },
            cost: ability.costs.kneelSelf(),
            chooseOpponent: opponent => !opponent.firstPlayer,
            message: '{player} kneels {source} to have {opponent} become first player',
            handler: context => {
                this.game.setFirstPlayer(context.opponent);
            }
        });
    }
}

TheEyrie.code = '23031';

module.exports = TheEyrie;
