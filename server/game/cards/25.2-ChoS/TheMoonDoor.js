import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TheMoonDoor extends DrawCard {
    // The Moon Door (25038)
    // You choose which player wins ties for initiative and dominance.
    // Reaction: After The Moon Door is knelt during a challenge, choose and kill a participating
    // character with printed STR 3 or lower.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: [
                ability.effects.choosesWinnerForInitiativeTies(),
                ability.effects.choosesWinnerForDominanceTies()
            ]
        });
        this.reaction({
            when: {
                onCardKneeled: (event, context) =>
                    event.card === context.source && context.game.isDuringChallenge()
            },
            target: {
                cardCondition: {
                    type: 'character',
                    location: 'play area',
                    participating: true,
                    printedStrengthOrLower: 3
                }
            },
            gameAction: GameActions.kill((context) => ({ card: context.target }))
        });
    }
}

TheMoonDoor.code = '25038';

export default TheMoonDoor;
