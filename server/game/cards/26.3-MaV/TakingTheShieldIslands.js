import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TakingTheShieldIslands extends DrawCard {
    // Taking the Shield Islands (26044)
    // Shadow (1).
    // Reaction: After you win a challenge in which you control an attacking Raider character, look
    // at the losing opponent's hand. Then, choose 1 card in that hand and place it on top of its
    // owner's deck. (Choose up to 2 cards and place them in any order instead if you played this
    // event from shadows.) (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        winner: context.player,
                        attackingPlayer: context.player
                    }) && event.challenge.getWinnerCards().some((card) => card.hasTrait('Raider'))
            },
            message: {
                format: "{player} plays {source} to look {loser}'s hand and place {amount} card(s) on top of their deck",
                args: {
                    loser: (context) => context.event.challenge.loser,
                    amount: (context) => getAmount(context)
                }
            },
            gameAction: GameActions.chooseCards({
                mode: 'upTo',
                numCards: (context) => getAmount(context),
                title: (context) =>
                    getAmount(context) === 1 ? 'Select a card' : 'Select up to 2 cards',
                revealTargets: true,
                cardCondition: (card, context) =>
                    card.location === 'hand' && card.controller === context.event.challenge.loser,
                gameAction: (card, context) =>
                    GameActions.placeCard({ card, player: context.player, location: 'draw deck' })
            })
        });
    }
}

function getAmount(context) {
    return context.cardStateWhenInitiated.location === 'shadows' ? 2 : 1;
}

TakingTheShieldIslands.code = '26044';

export default TakingTheShieldIslands;
