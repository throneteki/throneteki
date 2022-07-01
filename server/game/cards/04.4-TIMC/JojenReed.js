const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class JojenReed extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardStood: event => event.card === this
            },
            message: '{player} uses {source} to reveal the top cards of each player\'s deck',
            gameAction: GameActions.revealCards(context => ({
                cards: context.game.getPlayers().map(player => player.drawDeck[0]),
                player: context.player,
                whileRevealed: GameActions.choose({
                    choices: {
                        'Discard revealed cards': context => {
                            this.discard(context.revealed);
                        },
                        'Each player draw 1 card': () => {
                            this.draw();
                        }
                    }
                })
            }))
        });
    }

    draw() {
        for(let player of this.game.getPlayers()) {
            if(player.canDraw()) {
                player.drawCardsToHand(1);
            }
        }

        this.game.addMessage('{0} uses {1} to have each player draw 1 card', this.controller, this);
    }

    discard(cards) {
        // TODO: This cannot be re-implemented as simultaneous game actions until Tywin LoCR is re-implemented to
        // look at cards discard from a specific player's deck.
        for(let player of this.game.getPlayers()) {
            player.discardCards(cards.filter(card => card.owner === player));
        }

        this.game.addMessage('{0} uses {1} to have the revealed cards discarded', this.controller, this);
    }
}

JojenReed.code = '04061';

module.exports = JojenReed;
