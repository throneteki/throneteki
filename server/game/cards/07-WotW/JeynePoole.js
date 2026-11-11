import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class JeynePoole extends DrawCard {
    // Jeyne Poole (07033)
    // Marshaling Action: Sacrifice Jeyne Poole to return a Lady character from your discard pile to
    // your hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice Jeyne Poole',
            phase: 'marshal',
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'discard pile' &&
                    card.controller === context.player &&
                    card.hasTrait('Lady') &&
                    card.getType() === 'character'
            },
            message:
                '{player} sacrifices {source} to move {target} from their discard pile to their hand',
            gameAction: GameActions.addToHand((context) => ({ card: context.target }))
        });
    }
}

JeynePoole.code = '07033';

export default JeynePoole;
