const DrawCard = require('../../../drawcard.js');

class TheSeastoneChair extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onClaimApplied: event => (
                    event.challenge.isUnopposed() &&
                    event.challenge.challengeType === 'military' &&
                    event.challenge.attackingPlayer === this.controller)
            },
            cost: ability.costs.kneelFactionCard(),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' &&
                                       card.controller !== this.controller && card.attachments.size() === 0,
                gameAction: 'kill'
            },
            handler: context => {
                context.skipHandler();
                this.game.addMessage('{0} uses {1} and kneels their faction card to kill {2} instead of normal claim effects',
                    this.controller, this, context.target);
                context.target.controller.killCharacter(context.target);
            }
        });
    }
}

TheSeastoneChair.code = '02011';

module.exports = TheSeastoneChair;
