import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TheMoonDoor extends DrawCard {
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
                onCardKneeled: (event) => event.card === this && this.game.isDuringChallenge()
            },
            target: {
                cardCondition: {
                    type: 'character',
                    location: 'play area',
                    participating: true,
                    printedStrengthOrLower: 3
                }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.kill((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }
}

TheMoonDoor.code = '25038';

export default TheMoonDoor;
