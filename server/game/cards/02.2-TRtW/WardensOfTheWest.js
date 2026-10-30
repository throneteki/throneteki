import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class WardensOfTheWest extends PlotCard {
    // Wardens of the West (02030)
    // Reaction: After you win an [intrigue] challenge, pay 2 gold to have the losing opponent
    // choose and discard 2 cards from his or her hand.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.challengeType === 'intrigue'
            },
            cost: ability.costs.payGold(2),
            message: {
                format: '{player} uses {source} and pays 2 gold to have {loser} choose and discard 2 cards from their hand',
                args: { loser: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.chooseCards({
                player: (context) => context.event.challenge.loser,
                title: 'Select 2 cards to discard',
                mode: 'exactly',
                numCards: 2,
                cardCondition: (card, context) =>
                    card.location === 'hand' && card.controller === context.choosingPlayer,
                gameAction: (card) => GameActions.discardCard({ card })
            })
        });
    }
}

WardensOfTheWest.code = '02030';

export default WardensOfTheWest;
