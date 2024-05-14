import DrawCard from '../../drawcard.js';

class MaesterAtTheRock extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event) =>
                    event.card.isFaction('lannister') &&
                    event.card.controller === this.controller &&
                    event.card.location === 'discard pile'
            },
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                this.controller.moveCard(context.event.card, 'draw deck');
                this.game.addMessage(
                    '{0} kneels {1} to place {2} on top of their deck',
                    this.controller,
                    this,
                    context.event.card
                );
            }
        });
    }
}

MaesterAtTheRock.code = '08010';

export default MaesterAtTheRock;
