import DrawCard from '../../drawcard.js';

class MinaRedwyne extends DrawCard {
    // Mina Redwyne (20036)
    // Reaction: After The Queen of Thorns or a House Redwyne card enters play under your control or
    // your discard pile, draw 1 card. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card.controller === this.controller &&
                    (event.card.hasTrait('House Redwyne') ||
                        event.card.name === 'The Queen of Thorns') &&
                    this.controller.canDraw(),
                onCardPlaced: (event) =>
                    event.card.location === 'discard pile' &&
                    event.player === this.controller &&
                    event.card.owner === this.controller &&
                    (event.card.hasTrait('House Redwyne') ||
                        event.card.name === 'The Queen of Thorns') &&
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

MinaRedwyne.code = '20036';

export default MinaRedwyne;
