import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class UmberLoyalist extends DrawCard {
    // Umber Loyalist (11041)
    // Reaction: After Umber Loyalist enters play, draw 2 cards.
    // Forced Interrupt: When Umber Loyalist leaves play, choose and discard 2 cards from your hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 2 }))
        });

        this.forcedInterrupt({
            when: {
                onCardLeftPlay: (event) => event.card === this
            },
            message: '{player} is forced by {source} to choose and discard 2 cards from their hand',
            gameAction: GameActions.chooseCards({
                title: 'Select 2 cards to discard',
                mode: 'exactly',
                numCards: 2,
                cardCondition: (card, context) =>
                    card.location === 'hand' && card.controller === context.choosingPlayer,
                gameAction: (card) => GameActions.discardCard({ card })
            })
        });
    }
}

UmberLoyalist.code = '11041';

export default UmberLoyalist;
