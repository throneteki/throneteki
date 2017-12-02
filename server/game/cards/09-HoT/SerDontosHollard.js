const DrawCard = require('../../drawcard.js');

class SerDontosHollard extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharactersKilled: event => event.allowSave,
                onCardsDiscarded: event => event.allowSave
            },
            target: {
                cardCondition: (card, context) => context.event.cards.includes(card) && card.canBeSaved() && this.isControlledLady(card)
            },
            cost: ability.costs.standSelf(),
            handler: context => {
                context.event.saveCard(context.target);
                this.game.addMessage('{0} stands {1} to save {2}',
                    this.controller, this, context.target);
            }
        });
    }

    isControlledLady(card) {
        return card.location === 'play area' && card.controller === this.controller && card.hasTrait('Lady');
    }
}

SerDontosHollard.code = '09035';

module.exports = SerDontosHollard;
