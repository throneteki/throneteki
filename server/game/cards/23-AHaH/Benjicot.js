const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class Benjicot extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: event => event.challenge.isMatch({ winner: this.controller }) && this.isParticipating()
            },
            message: '{player} is forced by {source} to reveal the bottom card of each player\'s deck',
            // TODO: This will need to be re-implemented when the Alla reveal cards branch is merged
            gameAction: GameActions.simultaneously(context => context.game.getPlayers().map(player =>
                GameActions.revealCard({
                    card: player.drawDeck[player.drawDeck.length - 1]
                })
            )).then({
                handler: context => {
                    const cards = context.event.getConcurrentEvents().map(event => event.card).filter(card => !card.isFaction('neutral'));
                    const gameActions = [];
                    const traits = this.getTraits();
                    for(const card of cards) {
                        if(traits.some(trait => card.hasTrait(trait))) {
                            this.game.addMessage('{0} adds {1} to their hand', card.owner, card);
                            gameActions.push(GameActions.addToHand({ card }));
                        } else {
                            this.game.addMessage('{0} discards {1}', card.controller, card);
                            gameActions.push(GameActions.discardCard({ card }));
                        }
                    }

                    this.game.resolveGameAction(
                        GameActions.simultaneously(gameActions),
                        context
                    );
                }
            })
        });
    }
}

Benjicot.code = '23027';

module.exports = Benjicot;
