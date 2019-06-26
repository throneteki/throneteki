const DrawCard = require('../../drawcard.js');

class TunnelsOfTheRedKeep extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel and return to shadows',
            cost: ability.costs.kneelSelf(),
            limit: ability.limit.perPhase(1),
            handler: context => {
                context.player.putIntoShadows(this, false);
                this.game.addMessage('{0} kneels {1} to return it to shadows.', this.controller, this);
                this.untilEndOfPhase(ability => ({
                    match: card => card.getType() === 'character' && card.controller === this.controller,
                    effect: ability.effects.dynamicStrength(() => this.controller.shadows.length)
                }));
            }
        });
    }
}

TunnelsOfTheRedKeep.code = '13070';

module.exports = TunnelsOfTheRedKeep;
