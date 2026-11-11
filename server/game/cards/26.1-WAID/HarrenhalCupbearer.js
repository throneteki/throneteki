import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HarrenhalCupbearer extends DrawCard {
    // Harrenhal Cupbearer (26017)
    // Shadow (3).
    // Reaction: After you win a challenge in which Harrenhal Cupbearer is participating, return it
    // to shadows to choose and kneel a character with printed cost 5 or lower controlled by the
    // losing opponent.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.isParticipating()
            },
            cost: ability.costs.putSelfIntoShadows(),
            target: {
                cardCondition: (card, context) =>
                    card.controller === context.event.challenge.loser &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 5 &&
                    GameActions.kneelCard({ card }).allow()
            },
            message: '{player} returns {costs.putIntoShadows} to shadows to kneel {target}',
            gameAction: GameActions.kneelCard((context) => ({ card: context.target }))
        });
    }
}

HarrenhalCupbearer.code = '26017';

export default HarrenhalCupbearer;
