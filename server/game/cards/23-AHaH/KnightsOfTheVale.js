const DrawCard = require('../../drawcard.js');

class KnightsOfTheVale extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character +STR',
            phase: 'challenge',
            cost: ability.costs.kneel({ type: 'location', faction: 'neutral', printedCostOrHigher: 1 }),
            limit: ability.limit.perPhase(1),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: { type: 'character', defending: true, controller: this.controller, condition: card => card.getTraits().some(trait => this.hasTrait(trait)) }
            },
            message: {
                format: '{player} uses {source} and kneels {costs.kneel} to give {target} +{amount} STR until the end of the challenge',
                args: { amount: context => this.calculateSTR(context) }
            },
            handler: context => {
                this.untilEndOfChallenge(ability => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(this.calculateSTR(context))
                }));
            }
        });
    }

    calculateSTR(context) {
        return context.player.getTotalInitiative() === 0 ? 4 : 2;
    } 
}

KnightsOfTheVale.code = '23019';

module.exports = KnightsOfTheVale;
