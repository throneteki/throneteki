import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class AnyaWaynwood extends DrawCard {
    // Anya Waynwood (23018)
    // While you control Harry the Heir, he gains renown.
    // Challenges Action: Kneel a neutral location to choose a non-participating character with
    // equal or lower printed cost. That character contributes its STR to your side this challenge.
    // (Limit once per phase.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                card.name === 'Harry the Heir' && card.controller === context.source.controller,
            effect: ability.effects.addKeyword('Renown')
        });

        this.action({
            title: 'Contribute STR to challenge',
            phase: 'challenge',
            cost: ability.costs.kneel(
                (card) => card.getType() === 'location' && card.isFaction('neutral')
            ),
            condition: (context) => context.game.isDuringChallenge(),
            limit: ability.limit.perPhase(1),
            target: {
                cardCondition: {
                    location: 'play area',
                    type: 'character',
                    participating: false,
                    condition: (card, context) =>
                        !context.costs.kneel ||
                        card.getPrintedCost() <= context.costs.kneel.getPrintedCost()
                }
            },
            message: {
                format: "{player} uses {source} and kneels {costs.kneel} to have {target} contribute its STR (currently {str}) to {player}'s side of the challenge",
                args: { str: (context) => context.target.getStrength() }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                targetController: 'current',
                effect: ability.effects.contributeCharacterStrength(context.target)
            }))
        });
    }
}

AnyaWaynwood.code = '23018';

export default AnyaWaynwood;
