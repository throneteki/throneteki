const DrawCard = require('../../drawcard.js');

class MaesterAemon extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    event.allowSave &&
                    event.card.canBeSaved() &&
                    event.card.isFaction('thenightswatch') &&
                    event.card.controller === this.controller
            },
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                context.event.saveCard();
                this.game.addMessage(
                    '{0} kneels {1} to save {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

MaesterAemon.code = '01125';

module.exports = MaesterAemon;
