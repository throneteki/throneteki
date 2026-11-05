import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

const othersOnTop = (context) => {
    const deck = context.parentContext.chosenPlayer.drawDeck;
    const placed = context.parentContext.chosenCards || [];
    return deck.slice(0, Math.min(5, deck.length) - placed.length);
};

class TheBearAndTheMaidenFair extends DrawCard {
    // "The Bear and the Maiden Fair" (01197)
    // Action: Choose a player. Look at the top 5 cards of that player's deck. Place up to 3 of
    // those cards on the bottom of that deck, and the others on top, in any order.
    setupCardAbilities() {
        this.action({
            title: 'Look at top 5 cards of a deck',
            choosePlayer: (player) => player.drawDeck.length > 0,
            message: "{player} plays {source} to look at the top 5 cards of {chosenPlayer}'s deck",
            gameAction: GameActions.chooseCards({
                mode: 'upTo',
                numCards: 3,
                optional: true,
                revealTargets: true,
                title: 'Select up to 3 cards to place on the bottom',
                cardCondition: (card, context) =>
                    context.chosenPlayer.drawDeck.slice(0, 5).includes(card),
                gameAction: (card, context) =>
                    GameActions.placeCard({
                        card,
                        location: 'draw deck',
                        bottom: true,
                        player: context.player,
                        orderable: true
                    })
            }).then({
                message: {
                    format: "Then {player} places {amount} cards on the bottom of {chosenPlayer}'s deck and the rest on top",
                    args: {
                        amount: (context) => (context.parentContext.chosenCards || []).length,
                        chosenPlayer: (context) => context.parentContext.chosenPlayer
                    }
                },
                gameAction: GameActions.simultaneously((context) =>
                    othersOnTop(context).map((card) =>
                        GameActions.placeCard({
                            card,
                            location: 'draw deck',
                            player: context.player,
                            orderable: true
                        })
                    )
                )
            })
        });
    }
}

TheBearAndTheMaidenFair.code = '01197';

export default TheBearAndTheMaidenFair;
