const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class ArianneMartell extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put character into play',
            limit: ability.limit.perPhase(1),
            target: {
                cardCondition: card => card.location === 'hand' && card.controller === this.controller &&
                                       card.getPrintedCost() <= 5 && card.getType() === 'character' && this.controller.canPutIntoPlay(card)
            },
            message: '{player} uses {source} to put {target} into play',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.putIntoPlay(context => ({
                        card: context.target
                    })).then(preThenContext => ({
                        // If the card is in the "dupe" location, then a "character" wasn't put into play
                        condition: () => preThenContext.target.location === 'play area',
                        message: 'Then {player} returns {source} to hand',
                        gameAction: GameActions.returnCardToHand(context => ({ card: context.source }))
                    })),
                    context
                );
            }
        });
    }
}

ArianneMartell.code = '01104';

module.exports = ArianneMartell;
