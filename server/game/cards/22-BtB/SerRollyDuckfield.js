const DrawCard = require('../../drawcard.js');

class SerRollyDuckfield extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Aegon Targaryen',
            effect: ability.effects.addIcon('military')
        });
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    event.allowSave &&
                    event.card.canBeSaved() &&
                    (event.card.hasTrait('Lord') || event.card.hasTrait('King'))
            },
            cost: ability.costs.discardFromHand(),
            limit: ability.limit.perRound(1),
            handler: (context) => {
                context.event.saveCard();
                this.game.addMessage(
                    '{0} uses {1} and discards {2} from their hand to save {3}',
                    context.player,
                    this,
                    context.costs.discardFromHand,
                    context.event.card
                );
            }
        });
    }
}

SerRollyDuckfield.code = '22019';

module.exports = SerRollyDuckfield;
