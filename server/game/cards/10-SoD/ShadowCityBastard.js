const DrawCard = require('../../drawcard.js');

class ShadowCityBastard extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove icons from character',
            phase: 'challenge',
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 5
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: [
                        ability.effects.removeIcon('military'),
                        ability.effects.removeIcon('intrigue'),
                        ability.effects.removeIcon('power')
                    ]
                }));

                this.game.addMessage(
                    '{0} sacrifices {1} to remove a {2}, an {3}, and a {4} icon from {5} until the end of the phase',
                    context.player,
                    this,
                    'military',
                    'intrigue',
                    'power',
                    context.target
                );
            }
        });
    }
}

ShadowCityBastard.code = '10016';

module.exports = ShadowCityBastard;
