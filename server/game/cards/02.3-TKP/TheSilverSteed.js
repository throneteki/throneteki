const DrawCard = require('../../drawcard.js');

class TheSilverSteed extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction(
            { trait: 'Dothraki' },
            { name: 'Daenerys Targaryen' }
        );
        this.whileAttached({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'power' &&
                this.game.currentChallenge.isParticipating(this.parent)
            ),
            effect: ability.effects.addKeyword('Renown')
        });
        this.reaction({
            when: {
                onRenown: event => event.card === this.parent
            },
            handler: () => {
                // The sacrifice here is specifically an effect, not a cost
                this.controller.sacrificeCard(this);

                this.untilEndOfPhase(ability => ({
                    targetType: 'player',
                    targetController: 'current',
                    effect: ability.effects.modifyChallengeTypeLimit('power', 1)
                }));

                this.game.addMessage('{0} sacrifices {1} and is able to initiate an additional {2} challenge this phase', this.controller, this, 'power');
            }
        });
    }
}

TheSilverSteed.code = '02054';

module.exports = TheSilverSteed;
