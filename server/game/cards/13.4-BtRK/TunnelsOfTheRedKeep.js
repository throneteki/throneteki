const DrawCard = require('../../drawcard.js');

class TunnelsOfTheRedKeep extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel and return to shadows',
            cost: ability.costs.kneelSelf(),
            max: ability.limit.perPhase(1),
            handler: context => {
                context.player.putIntoShadows(this, false);
                this.game.addMessage('{0} kneels {1} to return it to shadows.', context.player, this);
                let targetCharacters = context.player.filterCardsInPlay(card => card.getType() === 'character');
                this.untilEndOfPhase(ability => ({
                    match: targetCharacters,
                    effect: ability.effects.dynamicStrength(() => context.player.shadows.length)
                }));
            }
        });
    }
}

TunnelsOfTheRedKeep.code = '13070';

module.exports = TunnelsOfTheRedKeep;
