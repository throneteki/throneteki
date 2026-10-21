import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AshaGreyjoy extends DrawCard {
    // Asha Greyjoy (17162)
    // Pillage. Stealth.
    // Reaction: After Asha Greyjoy discards a card using pillage, search the top X cards of your
    // deck for a card, reveal it, and add it to your hand. Shuffle your deck. X is the number of
    // cards in the losing opponent's discard pile. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event) =>
                    event.isPillage &&
                    event.source === this &&
                    this.game.currentChallenge.loser.discardPile.length >= 1
            },
            message: {
                format: '{player} uses {source} to search the top {amount} cards of their deck for a card',
                args: {
                    amount: (context) => context.game.currentChallenge.loser.discardPile.length
                }
            },
            limit: ability.limit.perPhase(1),
            gameAction: GameActions.search({
                title: 'Select a card',
                topCards: (context) => context.game.currentChallenge.loser.discardPile.length,
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

AshaGreyjoy.code = '17162';

export default AshaGreyjoy;
