import DrawCard from '../../drawcard.js';

class Windblown extends DrawCard {
    // Windblown (21011)
    // Assault. Shadow (3).
    // Reaction: After you win a challenge in which Windblown is participating, return it to shadows
    // to choose and stand an Army or Mercenary character.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player && this.isParticipating()
            },
            cost: ability.costs.putSelfIntoShadows(),
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.location === 'play area' &&
                    (card.hasTrait('Army') || card.hasTrait('Mercenary')),
                gameAction: 'stand'
            },
            handler: (context) => {
                context.player.standCard(context.target);
                this.game.addMessage(
                    '{0} returns {1} to shadows to stand {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

Windblown.code = '21011';

export default Windblown;
