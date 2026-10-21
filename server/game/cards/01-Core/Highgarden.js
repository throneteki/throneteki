import DrawCard from '../../drawcard.js';

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
            handler: (context) => {
                context.target.controller.standCard(context.target);
                this.game.currentChallenge.removeFromChallenge(context.target);
                this.game.addMessage(
                    '{0} kneels {1} and pays 1 gold to stand and remove {2} from the challenge',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

Highgarden.code = '01192';

export default Highgarden;
