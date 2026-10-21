import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TakeToTheSky extends DrawCard {
    // Take to the Sky! (26054)
    // Play only if you control a Dragon character.
    // Interrupt: When a Dragon or Stormborn character would be killed or discarded from play, save
    // it and return it to its owner's hand.
    setupCardAbilities() {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) => this.canBeSavedAndReturned(event),
                onCardDiscarded: (event) =>
                    event.card.location == 'play area' && this.canBeSavedAndReturned(event)
            },
            message: {
                format: '{player} plays {source} to save {card} and return it to hand',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.simultaneously((context) => [
                GameActions.genericHandler(() => {
                    context.event.saveCard();
                }),
                GameActions.returnCardToHand({
                    card: context.event.card
                })
            ])
        });
    }

    canBeSavedAndReturned(event) {
        return (
            event.allowSave &&
            event.card.isMatch({ trait: ['Dragon', 'Stormborn'] }) &&
            event.card.controller.anyCardsInPlay({ trait: 'Dragon' })
        );
    }
}

TakeToTheSky.code = '26054';

export default TakeToTheSky;
