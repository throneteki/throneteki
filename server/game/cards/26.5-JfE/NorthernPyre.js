import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class NorthernPyre extends DrawCard {
    // Northern Pyre (26082)
    // Challenges Action: If there is a Winter plot card revealed, kneel Northern Pyre to choose a
    // participating character. Until the end of the challenge, set that character's STR to 3.
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to set STR to 3',
            condition: (context) => context.game.anyPlotHasTrait('Winter'),
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: {
                    location: 'play area',
                    type: 'character',
                    participating: true
                }
            },
            message:
                "{player} kneels {costs.kneel} to set {target}'s STR to 3 until the end of the challenge",
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.target,
                effect: ability.effects.setStrength(3)
            }))
        });
    }
}

NorthernPyre.code = '26082';

export default NorthernPyre;
