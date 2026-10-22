import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WinterfellArcheryRange extends DrawCard {
    // Winterfell Archery Range (06062)
    // Action: During a [military] challenge, kneel Winterfell Archery Range to choose a
    // participating character with STR 3 or lower, and remove it from the challenge.
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove character from challenge',
            condition: (context) => context.game.isDuringChallenge({ challengeType: 'military' }),
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.isParticipating() &&
                    card.getType() === 'character' &&
                    card.getStrength() <= 3
            },
            message: '{player} kneels {source} to remove {target} from the challenge',
            gameAction: GameActions.removeFromChallenge((context) => ({ card: context.target }))
        });
    }
}

WinterfellArcheryRange.code = '06062';

export default WinterfellArcheryRange;
