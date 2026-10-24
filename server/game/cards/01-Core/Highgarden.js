import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Highgarden extends DrawCard {
    // Highgarden (01192)
    // Challenges Action: Kneel Highgarden and pay 1 gold to choose an attacking character. Stand
    // that character and remove it from the challenge.
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove character from challenge',
            phase: 'challenge',
            cost: [ability.costs.kneelSelf(), ability.costs.payGold(1)],
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.location === 'play area' &&
                    card.isAttacking()
            },
            message:
                '{player} kneels {source} and pays 1 gold to stand and remove {target} from the challenge',
            gameAction: GameActions.simultaneously([
                GameActions.standCard((context) => ({ card: context.target })),
                GameActions.removeFromChallenge((context) => ({ card: context.target }))
            ])
        });
    }
}

Highgarden.code = '01192';

export default Highgarden;
