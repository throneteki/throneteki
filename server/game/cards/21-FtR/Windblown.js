import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Windblown extends DrawCard {
    // Windblown (21011)
    // Assault. Shadow (3).
    // Reaction: After you win a challenge in which Windblown is participating, return it to shadows
    // to choose and stand an Army or Mercenary character.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player && context.source.isParticipating()
            },
            cost: ability.costs.putSelfIntoShadows(),
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.location === 'play area' &&
                    (card.hasTrait('Army') || card.hasTrait('Mercenary')),
                gameAction: 'stand'
            },
            message: '{player} returns {source} to shadows to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

Windblown.code = '21011';

export default Windblown;
