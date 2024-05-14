import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class CalmAsStillWater extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    event.card.hasPrintedCost() &&
                    event.card.getPrintedCost() <= 3 &&
                    event.card.canBeSaved() &&
                    event.allowSave
            },
            message: {
                format: "{player} plays {source} to save {character} and return it to its owner's hand",
                args: { character: (context) => context.event.card }
            },
            gameAction: GameActions.simultaneously([
                GameActions.genericHandler((context) => {
                    context.event.saveCard();
                }),
                GameActions.returnCardToHand((context) => ({ card: context.event.card }))
            ])
        });
    }
}

CalmAsStillWater.code = '25018';

export default CalmAsStillWater;
