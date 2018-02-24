const DrawCard = require('../../drawcard.js');

class SaltcliffeSailor extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.hasToken('gold'),
            effect: ability.effects.addKeyword('Stealth')
        });
        this.action({
            title: 'Move 1 gold to character',
            condition: () => this.hasToken('gold'),
            target: {
                type: 'select',
                cardCondition: card =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === this.controller &&
                    !card.isFaction('greyjoy')
            },
            handler: context => {
                this.modifyToken('gold', -1);
                context.target.modifyToken('gold', 1);

                this.game.addMessage('{0} moves 1 gold from {1} to {2}', this.controller, this, context.target);
            }
        });
    }
}

SaltcliffeSailor.code = '08111';

module.exports = SaltcliffeSailor;
