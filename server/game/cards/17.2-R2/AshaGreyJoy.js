import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AshaGreyjoy extends DrawCard {
    setupCardAbilities() {
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
