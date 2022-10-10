const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class Benjicot extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardStood: (event, context) => event.card === this && context.game.getPlayers().every(player => player.drawDeck.length > 0)
            },
            message: '{player} is forced by {source} to reveal the bottom card of each player\'s deck',
            gameAction: GameActions.revealCards(context => ({
                cards: context.game.getPlayers().map(player => player.drawDeck[player.drawDeck.length - 1])
            })).then({
                message: '{player} {gameAction}',
                gameAction: GameActions.simultaneously(context => this.buildGameActions(context.parentContext.revealed))
            })
        });
    }

    buildGameActions(revealed) {
        const gameActions = [];
        const traits = this.getTraits();
        for(const card of revealed) {
            if(traits.some(trait => card.hasTrait(trait))) {
                gameActions.push(GameActions.addToHand({ card }));
            } else {
                gameActions.push(GameActions.discardCard({ card }));
            }
        }
        return gameActions;
    }
}

Benjicot.code = '23027';

module.exports = Benjicot;
