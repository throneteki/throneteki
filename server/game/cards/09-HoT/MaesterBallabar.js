import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MaesterBallabar extends DrawCard {
    // Maester Ballabar (09014)
    // Action: During a challenge in which you control a participating character, kneel Maester
    // Ballabar to choose a character with the lowest STR among participating characters. Stand that
    // character and remove it from the challenge.
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand and remove character from challenge',
            condition: (context) =>
                context.game.currentChallenge &&
                context.game.currentChallenge.anyParticipants(
                    (card) => card.controller === context.source.controller
                ),
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card, context) =>
                    card.isParticipating() &&
                    card.getStrength() === context.source.getLowestParticipatingStrength()
            },
            message: '{player} kneels {source} to stand and remove {target} from the challenge',
            gameAction: GameActions.simultaneously([
                GameActions.standCard((context) => ({ card: context.target })),
                GameActions.removeFromChallenge((context) => ({ card: context.target }))
            ])
        });
    }

    getLowestParticipatingStrength() {
        let participatingCharacters = this.game.currentChallenge.attackers.concat(
            this.game.currentChallenge.defenders
        );
        let strengths = participatingCharacters.map((card) => card.getStrength());
        return Math.min(...strengths);
    }
}

MaesterBallabar.code = '09014';

export default MaesterBallabar;
