import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheShadowCity extends DrawCard {
    // The Shadow City (11017)
    // Shadow (2).
    // Reduce the cost to marshal each of your cards into shadows by 1.
    // Challenges Action: Kneel The Shadow City and discard 1 card from shadows to draw 2 cards.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceCost({
                playingTypes: 'marshalIntoShadows',
                amount: 1
            })
        });
        this.action({
            title: 'Draw 2 cards',
            phase: 'challenge',
            condition: (context) => context.source.controller.canDraw(),
            cost: [ability.costs.kneelSelf(), ability.costs.discardFromShadows()],
            message:
                '{player} kneels {source} and discards {costs.discardFromShadows} from shadows to draw 2 cards',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 2 }))
        });
    }
}

TheShadowCity.code = '11017';

export default TheShadowCity;
