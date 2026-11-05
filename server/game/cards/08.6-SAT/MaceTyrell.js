import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MaceTyrell extends DrawCard {
    // Mace Tyrell (08103)
    // Reaction: After Mace Tyrell is knelt, draw 2 cards. Then, choose a card in your hand and
    // place it on top of your deck.
    // +1 Income.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardKneeled: (event, context) => event.card === context.source
            },
            message: '{player} uses {source} to draw 2 cards',
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: 2
            })).then({
                target: {
                    activePromptTitle: 'Select a card',
                    cardCondition: { location: 'hand', controller: 'current' }
                },
                message: 'Then {player} places a card on top of their deck',
                gameAction: GameActions.returnCardToDeck((context) => ({
                    card: context.target
                }))
            })
        });
        this.plotModifiers({
            gold: 1
        });
    }
}

MaceTyrell.code = '08103';

export default MaceTyrell;
