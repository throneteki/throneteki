import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class AllardSeaworth extends DrawCard {
    // Allard Seaworth (25061)
    // Dominance Action: Discard a facedown card attached to a [baratheon] card you control to gain
    // 1 power for your faction. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard facedown card',
            phase: 'dominance',
            cost: ability.costs.discardFromPlay(
                (card, context) =>
                    card.facedown &&
                    card.getType() === 'attachment' &&
                    card.parent &&
                    card.parent.controller === context.player &&
                    card.parent.isFaction('baratheon')
            ),
            limit: ability.limit.perPhase(1),
            message: {
                format: '{player} uses {source} and discards {costs.discardFromPlay} from underneath {parent} to gain 1 power for their faction',
                args: {
                    parent: (context) => context.costStatesWhenInitiated.discardFromPlay.parent
                }
            },
            gameAction: GameActions.gainPower((context) => ({
                card: context.player.faction,
                amount: 1
            }))
        });
    }
}

AllardSeaworth.code = '25061';

export default AllardSeaworth;
