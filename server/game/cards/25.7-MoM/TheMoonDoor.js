const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class TheMoonDoor extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: [
                ability.effects.winsTiesForInitiative(),
                ability.effects.winsTiesForDominance()
            ]
        });
        this.reaction({
            when: {
                onCardKneeled: event => event.card === this && this.game.isDuringChallenge()
            },
            target: {
                cardCondition: { type: 'character', location: 'play area', participating: true, printedStrengthOrLower: 3 }
            },
            handler: context => {
                this.game.resolveGameAction(GameActions.kill(context => ({ card: context.target })), context);
            }
        });
    }
}

TheMoonDoor.code = '25606';
TheMoonDoor.version = '2.0';

module.exports = TheMoonDoor;
