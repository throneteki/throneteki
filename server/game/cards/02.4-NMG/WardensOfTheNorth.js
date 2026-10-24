import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

function isStarkCardParticipatingInChallenge(source) {
    return source.controller.anyCardsInPlay(
        (card) => card.isParticipating() && card.isFaction('stark')
    );
}

class WardensOfTheNorth extends PlotCard {
    // Wardens of the North (02062)
    // Challenges Action: During a challenge in which you control a participating [stark] character,
    // kneel another [stark] character to have it participate in that challenge on your side. (Limit
    // twice per round.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel a character to have it participate in the current challenge',
            phase: 'challenge',
            limit: ability.limit.perRound(2),
            condition: (context) => isStarkCardParticipatingInChallenge(context.source),
            cost: ability.costs.kneel(
                (card) =>
                    card.getType() === 'character' &&
                    card.isFaction('stark') &&
                    card.canParticipateInChallenge()
            ),
            message: '{player} uses {source} to kneel {costs.kneel} and add them to the challenge',
            gameAction: GameActions.addToChallenge((context) => ({
                card: context.costs.kneel,
                player: context.player
            }))
        });
    }
}

WardensOfTheNorth.code = '02062';

export default WardensOfTheNorth;
