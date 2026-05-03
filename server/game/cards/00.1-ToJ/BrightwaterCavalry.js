import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BrightwaterCavalry extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && this.controller.canDraw()
            },
            message: '{player} uses {source} to draw a card',
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: 1
            })).then({
                target: {
                    activePromptTitle: 'Select a card',
                    cardCondition: { location: 'hand', controller: 'current' }
                },
                message: 'Then {player} places a card on top of their deck',
                handler: (context) => {
                    this.game.resolveGameAction(
                        GameActions.returnCardToDeck((context) => ({
                            card: context.target
                        })),
                        context
                    );
                }
            })
        });
    }
}

BrightwaterCavalry.code = '00287';

export default BrightwaterCavalry;
