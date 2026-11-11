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
            message: {
                format: "{player} kneels {source} to place {target} on the bottom of {owner}'s deck",
                args: { owner: (context) => context.target.owner }
            },
            gameAction: GameActions.returnCardToDeck((context) => ({
                card: context.target,
                bottom: true
            }))
        });
    }
}

MeereeneseMarket.code = '11074';

export default MeereeneseMarket;
