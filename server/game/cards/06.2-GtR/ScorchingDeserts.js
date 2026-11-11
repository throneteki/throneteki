import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ScorchingDeserts extends DrawCard {
    // Scorching Deserts (06036)
    // Reaction: After a character with fewer than 2 challenge icons is declared as an attacker or
    // defender, kneel and sacrifice Scorching Deserts to remove that character from the challenge.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDeclaredAsAttacker: (event, context) =>
                    event.card.getNumberOfIcons() < 2 &&
                    event.card.controller !== context.source.controller,
                onDeclaredAsDefender: (event, context) =>
                    event.card.getNumberOfIcons() < 2 &&
                    event.card.controller !== context.source.controller
            },
            cost: [ability.costs.kneelSelf(), ability.costs.sacrificeSelf()],
            message: {
                format: '{player} kneels and sacrifices {source} to remove {card} from the challenge',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.removeFromChallenge((context) => ({ card: context.event.card }))
        });
    }
}

ScorchingDeserts.code = '06036';

export default ScorchingDeserts;
