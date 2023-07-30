const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class CalmAsStillWater extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: event => event.card.getPrintedStrength() <= 3 && event.card.canBeSaved() && event.allowSave
            },
            message: {
                format: '{player} plays {source} to save {character} and return them to their\'s owners hand',
                args: { character: context => context.event.card }
            },
            gameAction: GameActions.simultaneously([
                GameActions.genericHandler(context => {
                    context.event.saveCard();
                }),
                GameActions.returnCardToHand(context => ({ card: context.event.card }))
            ])
        });
    }
}

CalmAsStillWater.code = '25608';
CalmAsStillWater.version = '1.0';

module.exports = CalmAsStillWater;
