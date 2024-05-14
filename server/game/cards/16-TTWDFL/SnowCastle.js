const DrawCard = require('../../drawcard');

class SnowCastle extends DrawCard {
    setupCardAbilities(ability) {
        const strength = (context) =>
            context.player.getNumberOfCardsInPlay({ faction: 'stark', type: 'character' });

        this.action({
            title: 'Give +STR',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: { location: 'play area', faction: 'stark', type: 'character' }
            },
            message: {
                format: '{player} kneels {source} to give {target} +{strength} STR',
                args: { strength }
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(strength(context))
                }));
            }
        });
    }
}

SnowCastle.code = '16012';

module.exports = SnowCastle;
