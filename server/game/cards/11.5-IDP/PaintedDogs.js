import DrawCard from '../../drawcard.js';

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
            handler: (context) => {
                this.game.addMessage(
                    '{0} returns {1} to hand to stand {2}',
                    context.player,
                    this,
                    context.target
                );
                context.player.standCard(context.target);
            }
        });
    }
}

PaintedDogs.code = '11089';

export default PaintedDogs;
