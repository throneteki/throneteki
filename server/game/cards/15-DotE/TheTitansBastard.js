import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheTitansBastard extends DrawCard {
    // The Titan's Bastard (15010)
    // Action: Kneel The Titan's Bastard to return a Mercenary character from your discard pile to
    // your hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Return a Mercenary',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'discard pile' &&
                    card.controller === context.player &&
                    card.hasTrait('Mercenary') &&
                    card.getType() === 'character'
            },
            message:
                '{player} kneels {source} to move {target} from their discard pile to their hand',
            gameAction: GameActions.addToHand((context) => ({ card: context.target }))
        });
    }
}

TheTitansBastard.code = '15010';

export default TheTitansBastard;
