const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class MaceTyrell extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardKneeled: event => event.card === this
            },
            message: '{player} uses {source} to draw 2 cards',
            gameAction: GameActions.drawCards(context => ({
                player: context.player,
                amount: 2
            })).then({
                target: {
                    activePromptTitle: 'Select a card',
                    cardCondition: { location: 'hand', controller: 'current' }
                },
                message: 'Then {player} places a card on top of their deck',
                handler: context => {
                    this.game.resolveGameAction(
                        GameActions.returnCardToDeck(context => ({
                            card: context.target
                        })),
                        context
                    );
                }
            })
        });
        this.plotModifiers({
            gold: 1
        });
    }
}

MaceTyrell.code = '08103';

module.exports = MaceTyrell;
