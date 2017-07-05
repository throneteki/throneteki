const DrawCard = require('../../../drawcard.js');

class TheRedKeep extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'power' &&
                this.game.currentChallenge.anyParticipants(card => card.controller === this.controller)
            ),
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.contributeChallengeStrength(2)
        });
        this.interrupt({
            when: {
                onPhaseEnded: (event, phase) => phase === 'challenge' &&
                    this.controller.getNumberOfChallengesLost('power') === 0
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                this.game.addMessage('{0} kneels {1} to draw 2 cards', this.controller, this);

                this.controller.drawCardsToHand(2);
            }
        });
    }
}

TheRedKeep.code = '01061';

module.exports = TheRedKeep;
