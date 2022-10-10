const DrawCard = require('../../drawcard.js');
const Message = require('../../Message');

class KnightsOfTheVale extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character +STR',
            phase: 'challenge',
            cost: ability.costs.kneel({ type: 'location', faction: 'neutral', printedCostOrHigher: 1 }),
            limit: ability.limit.perPhase(1),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: { type: 'character', defending: true, trait: 'House Arryn', controller: this.controller }
            },
            message: {
                format: '{player} uses {source} and kneels their faction card to {strengthMessage} until the end of the challenge',
                args: { strengthMessage: context => Message.fragment(context.player.getTotalInitiative() === 0 ? 'double {target}\'s STR' : 'give {target} +3 STR', { target: context.target }) }
            },
            handler: context => {
                this.untilEndOfChallenge(ability => ({
                    match: context.target,
                    effect: context.player.getTotalInitiative() === 0 ? ability.effects.modifyStrengthMultiplier(2) : ability.effects.modifyStrength(3)
                }));
            }
        });
    }
}

KnightsOfTheVale.code = '23017';

module.exports = KnightsOfTheVale;
