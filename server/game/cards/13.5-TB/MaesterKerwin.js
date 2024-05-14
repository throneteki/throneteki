const DrawCard = require('../../drawcard.js');

class MaesterKerwin extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    event.allowSave &&
                    event.card.canBeSaved() &&
                    event.card.controller === this.controller &&
                    event.card !== this
            },
            cost: ability.costs.killSelf(),
            handler: (context) => {
                context.event.saveCard();
                this.game.addMessage(
                    '{0} kills {1} to save {2}',
                    context.player,
                    this,
                    context.event.card
                );
            }
        });
    }
}

MaesterKerwin.code = '13091';

module.exports = MaesterKerwin;
