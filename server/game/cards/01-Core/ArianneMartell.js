import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ArianneMartell extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put character into play',
            limit: ability.limit.perPhase(1),
            target: {
                cardCondition: (card) =>
                    card.location === 'hand' &&
                    card.controller === this.controller &&
                    card.getPrintedCost() <= 5 &&
                    card.getType() === 'character' &&
                    this.controller.canPutIntoPlay(card)
            },
            message: '{player} uses {source} to put {target} into play',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.putIntoPlay((context) => ({
                        card: context.target
                    })).then({
                        message: 'Then {player} returns {source} to hand',
                        gameAction: GameActions.returnCardToHand((context) => ({
                            card: context.source,
                            allowSave: false
                        }))
                    }),
                    context
                );
            }
        });
    }
}

ArianneMartell.code = '01104';

export default ArianneMartell;
