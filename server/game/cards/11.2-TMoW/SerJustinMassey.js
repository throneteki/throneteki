const DrawCard = require('../../drawcard');

class SerJustinMassey extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.controller.anyCardsInPlay(
                    (card) => card.hasTrait('King') && card.getType() === 'character'
                ),
            match: this,
            effect: ability.effects.addKeyword('renown')
        });
        this.reaction({
            when: {
                onCardPowerGained: (event) =>
                    event.card.isFaction('baratheon') &&
                    event.card.getType() === 'character' &&
                    event.card.kneeled
            },
            limit: ability.limit.perPhase(1),
            handler: (context) => {
                context.player.standCard(context.event.card);
                this.game.addMessage(
                    '{0} uses {1} to stand {2}',
                    context.player,
                    this,
                    context.event.card
                );
            }
        });
    }
}

SerJustinMassey.code = '11027';

module.exports = SerJustinMassey;
