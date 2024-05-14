const DrawCard = require('../../drawcard.js');

class WildlingScout extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give another character stealth',
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' && card.location === 'play area'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} sacrifices {1} to make {2} gain stealth',
                    context.player,
                    this,
                    context.target
                );
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.addKeyword('Stealth')
                }));
            }
        });
    }
}

WildlingScout.code = '02078';

module.exports = WildlingScout;
