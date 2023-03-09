const DrawCard = require('../../drawcard.js');

class TheSilverSteed extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction(
            { trait: 'Dothraki' },
            { name: 'Daenerys Targaryen' }
        );
        this.whileAttached({
            condition: () => (
                this.game.isDuringChallenge({ challengeType: 'power' }) &&
                this.parent.isParticipating()
            ),
            effect: ability.effects.addKeyword('Renown')
        });
        this.reaction({
            when: {
                onCardPowerGained: event => event.card === this.parent && reason === 'renown'
            },
            handler: () => {
                // The sacrifice here is specifically an effect, not a cost
                this.controller.sacrificeCard(this);

                this.untilEndOfPhase(ability => ({
                    targetController: 'current',
                    effect: ability.effects.mayInitiateAdditionalChallenge('power')
                }));

                this.game.addMessage('{0} sacrifices {1} and is able to initiate an additional {2} challenge this phase', this.controller, this, 'power');
            }
        });
    }
}

TheSilverSteed.code = '02054';

module.exports = TheSilverSteed;
