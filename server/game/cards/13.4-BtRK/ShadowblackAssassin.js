const DrawCard = require('../../drawcard');

class ShadowblackAssassin extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: event => event.card === this
            },
            target: {
                type: 'select',
                activePromptTitle: 'Select a character with STR 1',
                cardCondition: card => card.location === 'play area' && card.controller !== this.controller && card.getType() === 'character' && card.getStrength() === 1
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to kill {2}', context.player, this, context.target);
                this.game.killCharacter(context.target);
            }
        });
    }
}

ShadowblackAssassin.code = 'TODO';

module.exports = ShadowblackAssassin;
