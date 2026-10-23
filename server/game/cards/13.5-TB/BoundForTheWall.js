import DrawCard from '../../drawcard.js';
import shuffle from 'lodash.shuffle';
import GameActions from '../../GameActions/index.js';

class BoundForTheWall extends DrawCard {
    // Bound for the Wall (13086)
    // Reaction: After you win a challenge as the attacking player, reveal the top 5 cards of the
    // losing opponent's deck. You may put a character revealed this way into play under your
    // control. Place the other revealed cards on the bottom of that player's deck in a random
    // order. (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        winner: context.player,
                        attackingPlayer: context.player
                    })
            },
            message: {
                format: "{player} plays {source} to reveal the top 5 cards of {loser}'s deck",
                args: { loser: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.revealTopCards((context) => ({
                player: context.event.challenge.loser,
                amount: 5,
                whileRevealed: GameActions.chooseCards({
                    optional: true,
                    title: 'Select a character',
                    cardCondition: (card, context) =>
                        context.revealed.includes(card) && card.getType() === 'character',
                    gameAction: (card, context) =>
                        GameActions.putIntoPlay({ card, player: context.player })
                })
            })).then({
                message: {
                    format: "Then {player} places {cards} on the bottom of {loser}'s deck in random order",
                    args: {
                        cards: (context) => remainingCards(context),
                        loser: (context) => context.parentContext.event.challenge.loser
                    }
                },
                gameAction: GameActions.simultaneously((context) =>
                    shuffle(remainingCards(context)).map((card) =>
                        GameActions.placeCard({
                            card,
                            location: 'draw deck',
                            bottom: true,
                            orderable: false
                        })
                    )
                )
            }),
            max: ability.limit.perChallenge(1)
        });
    }
}

function remainingCards(context) {
    return context.parentContext.revealed.filter((card) => card.location === 'draw deck');
}

BoundForTheWall.code = '13086';

export default BoundForTheWall;
