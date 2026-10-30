import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WhiteHarbor extends DrawCard {
    // White Harbor (11042)
    // Reaction: After you win a challenge, reveal the top 2 cards of your deck. The losing opponent
    // chooses 1 of those cards. Add that card to your hand, and place the other on the bottom of
    // your deck.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) => event.challenge.winner === context.player
            },
            message: '{player} uses {source} to reveal the top 2 cards of their deck',
            gameAction: GameActions.revealTopCards((context) => ({
                player: context.player,
                amount: 2,
                whileRevealed: GameActions.chooseCards({
                    player: (context) => context.event.challenge.loser,
                    title: (context) => `Select a card to add to ${context.player.name}'s hand`,
                    cardCondition: (card, context) => context.revealed.includes(card),
                    gameAction: (card, context) =>
                        GameActions.addToHand({ card, player: context.player })
                })
            })).then({
                message: 'Then {player} places the other card on the bottom of their deck',
                gameAction: GameActions.simultaneously((context) =>
                    context.parentContext.revealed
                        .filter((card) => card.location === 'draw deck')
                        .map((card) =>
                            GameActions.placeCard({
                                card,
                                player: context.player,
                                location: 'draw deck',
                                bottom: true
                            })
                        )
                )
            })
        });
    }
}

WhiteHarbor.code = '11042';

export default WhiteHarbor;
