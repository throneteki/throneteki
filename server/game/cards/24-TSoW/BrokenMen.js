import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BrokenMen extends DrawCard {
    // Broken Men (24029)
    // Reaction: After you lose a [military] challenge, sacrifice a location to choose a
    // participating character with the Army trait or printed cost 4 or lower, and discard it from
    // play.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.challengeType === 'military' &&
                    event.challenge.loser === context.source.controller
            },
            cost: ability.costs.sacrifice((card) => card.getType() === 'location'),
            target: {
                cardCondition: {
                    participating: true,
                    or: [{ printedCostOrLower: 4 }, { trait: 'Army' }]
                }
            },
            message:
                '{player} plays {source} and sacrifices {costs.sacrificeCard} to discard {target} from play',
            gameAction: GameActions.discardCard((context) => ({
                card: context.target,
                source: context.source
            }))
        });
    }
}

BrokenMen.code = '24029';

export default BrokenMen;
