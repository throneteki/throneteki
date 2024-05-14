const DrawCard = require('../../drawcard.js');

class Halder extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel a location or attachment',
            limit: ability.limit.perRound(2),
            cost: ability.costs.kneelAny(
                (card) =>
                    card.location === 'play area' &&
                    card.isFaction('thenightswatch') &&
                    (card.getType() === 'location' || card.getType() === 'attachment')
            ),
            target: {
                cardCondition: (card) =>
                    card.isFaction('thenightswatch') &&
                    card.getType() === 'character' &&
                    card.location === 'play area'
            },
            message: {
                format: '{player} uses {source} and kneels {kneeledCards} to give {target} +{strBoost} STR until the end of the phase',
                args: {
                    kneeledCards: (context) => context.costs.kneel,
                    strBoost: (context) => context.costs.kneel.length
                }
            },
            handler: (context) => {
                let strBoost = context.costs.kneel.length;

                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(strBoost)
                }));
            }
        });
    }
}

Halder.code = '17118';

module.exports = Halder;
