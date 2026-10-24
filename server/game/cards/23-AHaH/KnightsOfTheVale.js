import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class KnightsOfTheVale extends DrawCard {
    // Knights of the Vale (23019)
    // Assault. No attachments.
    // Challenges Action: Kneel a neutral location with printed cost 1 or higher to choose a
    // defending character that shares a Trait with Knights of the Vale. Until the end of the
    // challenge, that character gets +2 STR. (+4 STR instead if your initiative value is 0.) (Limit
    // once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character +STR',
            phase: 'challenge',
            cost: ability.costs.kneel({
                type: 'location',
                faction: 'neutral',
                printedCostOrHigher: 1
            }),
            limit: ability.limit.perPhase(1),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: {
                    type: 'character',
                    defending: true,
                    condition: (card, context) =>
                        card.controller === context.player &&
                        card.getTraits().some((trait) => context.source.hasTrait(trait))
                }
            },
            message: {
                format: '{player} uses {source} and kneels {costs.kneel} to give {target} +{amount} STR until the end of the challenge',
                args: { amount: (context) => context.source.calculateSTR(context) }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.target,
                effect: ability.effects.modifyStrength(context.source.calculateSTR(context))
            }))
        });
    }

    calculateSTR(context) {
        return context.player.getInitiative() === 0 ? 4 : 2;
    }
}

KnightsOfTheVale.code = '23019';

export default KnightsOfTheVale;
