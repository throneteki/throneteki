const DrawCard = require('../../drawcard.js');

class SeptonMeribald extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand up to 3 characters',
            cost: ability.costs.kneelSelf(),
            target: {
                mode: 'upTo',
                numCards: 3,
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' &&
                                       card.getPrintedStrength() <= 1 && card.kneeled,
                gameAction: 'stand'
            },
            handler: context => {
                for(let card of context.target) {
                    card.controller.standCard(card);
                }
                this.game.addMessage('{0} kneels {1} to stand {2}', context.player, this, context.target);
            }
        });
    }
}

SeptonMeribald.code = '10040';

module.exports = SeptonMeribald;
