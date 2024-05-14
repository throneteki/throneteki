const DrawCard = require('../../drawcard.js');

class IronMines extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    event.allowSave &&
                    event.card.canBeSaved() &&
                    event.card.controller === this.controller
            },
            cost: ability.costs.sacrificeSelf(),
            handler: (context) => {
                context.event.saveCard();
                this.game.addMessage(
                    '{0} sacrifices {1} to save {2}',
                    context.player,
                    this,
                    context.event.card
                );
            }
        });
    }
}

IronMines.code = '02092';

module.exports = IronMines;
