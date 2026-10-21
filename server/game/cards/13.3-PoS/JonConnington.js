import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class JonConnington extends DrawCard {
    // Jon Connington (13053)
    // Shadow (5). Renown.
    // Reaction: After Jon Connington comes out of shadows, choose and reveal a card you control in
    // shadows. If it is a non-event card with printed cost 4 or lower, put it into play.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                cardCondition: (card, context) =>
                    card.controller === context.player && card.location === 'shadows'
            },
            message: '{player} uses {source} to reveal a card from shadows',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.revealCards((context) => ({
                        player: context.player,
                        cards: [context.target]
                    })).then({
                        condition: (context) =>
                            context.event.cards[0].isMatch({
                                printedCostOrLower: 4,
                                not: { type: 'event' }
                            }) && context.parentContext.revealed.length > 0,
                        message: '{player} {gameAction}',
                        gameAction: GameActions.putIntoPlay((context) => ({
                            card: context.parentContext.revealed[0]
                        }))
                    }),
                    context
                );
            }
        });
    }
}

JonConnington.code = '13053';

export default JonConnington;
