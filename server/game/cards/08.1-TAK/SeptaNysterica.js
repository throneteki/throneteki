import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SeptaNysterica extends DrawCard {
    // Septa Nysterica (08004)
    // Action: Kneel Septa Nysterica to choose an attacking character with STR 4 or lower. Stand
    // that character and remove it from the challenge.
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove character from challenge',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.location === 'play area' &&
                    card.isAttacking() &&
                    card.getStrength() <= 4
            },
            message: '{player} kneels {source} to stand and remove {target} from the challenge',
            gameAction: GameActions.simultaneously([
                GameActions.standCard((context) => ({ card: context.target })),
                GameActions.removeFromChallenge((context) => ({ card: context.target }))
            ])
        });
    }
}

SeptaNysterica.code = '08004';

export default SeptaNysterica;
