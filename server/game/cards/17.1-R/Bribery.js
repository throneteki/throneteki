const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class Bribery extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            cost: ability.costs.payXGold(() => this.getMinXValue(), () => 99),
            target: {
                cardCondition: (card, context) => (
                    card.isMatch({ location: 'play area', type: 'character', kneeled: false }) &&
                    (!context.xValue || card.getPrintedCost() <= context.xValue) &&
                    card.allowGameAction('kneel')
                )
            },
            handler: context => {
                this.game.addMessage('{0} plays {1} and pays {2} gold to kneel {3}',
                    this.controller, this, context.xValue, context.target);
                
                //save context on this object to later use in button methods
                this.context = context;

                this.game.resolveGameAction(
                    GameActions.kneelCard(context => ({ card: context.target }))
                        .then(preThenContext => ({
                            handler: () => {
                                if((preThenContext.target.hasTrait('Ally') || preThenContext.target.hasTrait('Mercenary')) && preThenContext.target.attachments.length === 0) {
                                    const buttons = [];
                                    buttons.push({ text: 'Take control', method: 'takeControl' });
                                    buttons.push({ text: 'Cancel', method: 'cancelTakeControl' });
                                    this.game.promptWithMenu(context.player, this, {
                                        activePrompt: {
                                            menuTitle: 'Take control of character?',
                                            buttons: buttons
                                        },
                                        source: this
                                    });
                                }
                            }
                        })),
                    context
                );
            }
        });
    }

    getMinXValue() {
        const characters = this.game.filterCardsInPlay(card => card.isMatch({ type: 'character', kneeled: false }));
        const costs = characters.map(card => card.getPrintedCost());
        return Math.min(...costs);
    }

    takeControl(player) {
        this.game.takeControl(player, this.context.target);

        this.game.addMessage('{0} then uses {1} to take control of {2}',
            player, this, this.context.target);

        return true;
    }

    cancelTakeControl(player) {
        this.game.addMessage('{0} then uses {1} but does not take control of {2}',
            player, this, this.context.target);

        return true;
    }
}

Bribery.code = '17146';

module.exports = Bribery;
