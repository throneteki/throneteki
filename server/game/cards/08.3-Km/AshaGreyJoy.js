import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AshaGreyjoy extends DrawCard {
    // Asha Greyjoy (08051)
    // Pillage. Stealth.
    // Reaction: After Asha Greyjoy discards a card using pillage, search the top X cards of your
    // deck for a card and add it to your hand. Shuffle your deck. X is the number of cards in the
    // losing opponent's discard pile.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.isPillage &&
                    event.source === context.source &&
                    context.game.currentChallenge.loser.discardPile.length >= 1
            },
            message: {
                format: '{player} uses {source} to search the top {amount} cards of their deck for a card',
                args: {
                    amount: (context) => context.game.currentChallenge.loser.discardPile.length
                }
            },
            gameAction: GameActions.search({
                title: 'Select a card',
                topCards: (context) => context.game.currentChallenge.loser.discardPile.length,
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget,
                    reveal: false
                }))
            })
        });
    }
}

AshaGreyjoy.code = '08051';

export default AshaGreyjoy;
