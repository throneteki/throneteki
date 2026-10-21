import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MeereeneseMarket extends DrawCard {
    // Meereenese Market (11074)
    // Action: Kneel Meereenese Market to choose a card in a discard pile and place it on the bottom
    // of its owner's deck.
    // +1 Income.
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });

        this.action({
            title: 'Place card on bottom of deck',
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) => card.location === 'discard pile'
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.returnCardToDeck((context) => ({
                        card: context.target,
                        bottom: true
                    })),
                    context
                );
                this.game.addMessage(
                    "{0} kneels {1} to place {2} on the bottom of {3}'s deck",
                    this.controller,
                    this,
                    context.target,
                    context.target.owner
                );
            }
        });
    }
}

MeereeneseMarket.code = '11074';

export default MeereeneseMarket;
