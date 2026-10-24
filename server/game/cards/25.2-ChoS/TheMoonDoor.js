import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TheMoonDoor extends DrawCard {
    // The Moon Door (25038)
    // You choose which player wins ties for initiative and dominance.
    // Reaction: After The Moon Door is knelt during a challenge, choose and kill a participating
    // character with printed STR 3 or lower.
    setupCardAbilities(ability) {
        // TODO: Handle scenario where 2 or more TheMoonDoor's are in play; first player should decide which passive is active (with that decision lasting until any more are added or removed).
        //       Should likely be tied to effects, rather than Moon Door, in case there are existing effects which conflict.
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
