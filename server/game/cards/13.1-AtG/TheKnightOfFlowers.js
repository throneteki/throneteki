import DrawCard from '../../drawcard.js';

class TheKnightOfFlowers extends DrawCard {
    // The Knight of Flowers (13003)
    // Shadow (5). Renown.
    // Reaction: After a card you control comes out of shadows, choose and stand a Kingsguard
    // character. (Limit twice per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card.controller === this.controller
            },
            limit: ability.limit.perPhase(2),
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' && card.hasTrait('Kingsguard') && card.kneeled
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to stand {2}',
                    this.controller,
                    this,
                    context.target
                );
                context.player.standCard(context.target);
            }
        });
    }
}

TheKnightOfFlowers.code = '13003';

export default TheKnightOfFlowers;
