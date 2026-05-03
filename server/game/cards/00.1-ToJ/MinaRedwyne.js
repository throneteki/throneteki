import DrawCard from '../../drawcard.js';

class MinaRedwyne extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card.controller === this.controller &&
                    (event.card.hasTrait('House Redwyne') || event.card.hasTrait('Knight')) &&
                    this.controller.canDraw(),
                onCardPlaced: (event) =>
                    event.card.location === 'discard pile' &&
                    event.player === this.controller &&
                    event.card.owner === this.controller &&
                    (event.card.hasTrait('House Redwyne') || event.card.hasTrait('Knight')) &&
                    this.controller.canDraw()
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to draw 1 card',
            handler: (context) => {
                context.player.drawCardsToHand(1);
            }
        });
    }
}

MinaRedwyne.code = '00277';

export default MinaRedwyne;
