import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class PaintedDogs extends DrawCard {
    // Painted Dogs (11089)
    // Ambush (4).
    // Challenges Action: Return Painted Dogs to your hand to choose and stand a Clansman character
    // or Tyrion Lannister.
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand Clansman or Tyrion',
            phase: 'challenge',
            cost: ability.costs.returnSelfToHand(),
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.location === 'play area' &&
                    (card.hasTrait('Clansman') || card.name === 'Tyrion Lannister'),
                gameAction: 'stand'
            },
            message: '{player} returns {source} to hand to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

PaintedDogs.code = '11089';

export default PaintedDogs;
