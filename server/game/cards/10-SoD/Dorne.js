import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Dorne extends DrawCard {
    // Dorne (10017)
    // Reaction: After you lose a challenge, look at the top 2 cards of your deck. Add 1 to your
    // hand, and place the other on the bottom of your deck.
    // +1 Reserve.
    setupCardAbilities() {
        this.plotModifiers({ reserve: 1 });
        this.reaction({
            when: {
                afterChallenge: (event, context) => event.challenge.loser === context.player
            },
            message:
                '{player} uses {source} to look at the top 2 cards of their deck, add 1 to hand and place the other on the bottom',
            gameAction: GameActions.chooseCards({
                title: 'Select a card to add to hand',
                revealTargets: true,
                cardCondition: (card, context) =>
                    context.player.drawDeck.slice(0, 2).includes(card),
                gameAction: (card, context) =>
                    GameActions.simultaneously([
                        GameActions.addToHand({ card }),
                        ...context.player.drawDeck
                            .slice(0, 2)
                            .filter((other) => other !== card)
                            .map((other) =>
                                GameActions.placeCard({
                                    card: other,
                                    location: 'draw deck',
                                    bottom: true
                                })
                            )
                    ])
            })
        });
    }
}

Dorne.code = '10017';

export default Dorne;
