import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MinaRedwyne extends DrawCard {
    // Mina Redwyne (20036)
    // Reaction: After The Queen of Thorns or a House Redwyne card enters play under your control or
    // your discard pile, draw 1 card. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.controller === context.source.controller &&
                    (event.card.hasTrait('House Redwyne') ||
                        event.card.name === 'The Queen of Thorns') &&
                    context.source.controller.canDraw(),
                onCardPlaced: (event, context) =>
                    event.card.location === 'discard pile' &&
                    event.player === context.source.controller &&
                    event.card.owner === context.source.controller &&
                    (event.card.hasTrait('House Redwyne') ||
                        event.card.name === 'The Queen of Thorns') &&
                    context.source.controller.canDraw()
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

MinaRedwyne.code = '20036';

export default MinaRedwyne;
