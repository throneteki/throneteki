import DrawCard from '../../drawcard.js';

class ScorchingDeserts extends DrawCard {
    // Scorching Deserts (06036)
    // Reaction: After a character with fewer than 2 challenge icons is declared as an attacker or
    // defender, kneel and sacrifice Scorching Deserts to remove that character from the challenge.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDeclaredAsAttacker: (event) =>
                    event.card.getNumberOfIcons() < 2 && event.card.controller !== this.controller,
                onDeclaredAsDefender: (event) =>
                    event.card.getNumberOfIcons() < 2 && event.card.controller !== this.controller
            },
            cost: [ability.costs.kneelSelf(), ability.costs.sacrificeSelf()],
            handler: (context) => {
                this.game.currentChallenge.removeFromChallenge(context.event.card);
                this.game.addMessage(
                    '{0} kneels and sacrifices {1} to remove {2} from the challenge',
                    context.player,
                    this,
                    context.event.card
                );
            }
        });
    }
}

ScorchingDeserts.code = '06036';

export default ScorchingDeserts;
