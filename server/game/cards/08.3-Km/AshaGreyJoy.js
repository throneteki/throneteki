const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class AshaGreyjoy extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardDiscarded: event => event.isPillage && event.source === this && this.game.currentChallenge.loser.discardPile.length >= 1
            },
            message: {
                format: '{player} uses {source} to search the top {amount} cards of their deck for a card',
                args: { amount: context => context.game.currentChallenge.loser.discardPile.length }
            },
            gameAction: GameActions.search({
                title: 'Select a card',
                topCards: context => context.game.currentChallenge.loser.discardPile.length,
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand(context => ({
                    card: context.searchTarget,
                    reveal: false
                }))
            })
        });
    }
}

AshaGreyjoy.code = '08051';

module.exports = AshaGreyjoy;
