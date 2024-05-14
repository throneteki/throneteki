const DrawCard = require('../../drawcard.js');

class SerDontosHollard extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    event.allowSave && event.card.canBeSaved() && this.isLady(event.card),
                onCardDiscarded: (event) =>
                    event.allowSave && event.card.canBeSaved() && this.isLady(event.card)
            },
            cost: ability.costs.standSelf(),
            handler: (context) => {
                context.event.saveCard();
                this.game.addMessage(
                    '{0} stands {1} to save {2}',
                    this.controller,
                    this,
                    context.event.card
                );
            }
        });
    }

    isLady(card) {
        return card.location === 'play area' && card.hasTrait('Lady');
    }
}

SerDontosHollard.code = '09035';

module.exports = SerDontosHollard;
