const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class Bribery extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            cost: ability.costs.payXGold(() => this.getMinXValue(), () => 99),
            target: {
                cardCondition: (card, context) => (
                    card.isMatch({ location: 'play area', type: 'character', kneeled: false }) &&
                    (!context.xValue || card.getPrintedCost() <= context.xValue)
                ),
                gameAction: 'kneel'
            },
            handler: context => {
                this.context = context;
                if(context.target.hasTrait('Ally') || context.target.hasTrait('Mercenary')) {
                    let buttons = [
                        { text: 'Kneel', method: 'kneelCharacter' },
                        { text: 'Take control', method: 'takeControl' }
                    ];

                    this.game.promptWithMenu(context.player, this, {
                        activePrompt: {
                            menuTitle: 'Take control of character?',
                            buttons: buttons
                        },
                        source: this
                    });
                } else {
                    this.kneelCharacter(context.player);
                }
            }
        });
    }

    getMinXValue() {
        const characters = this.game.filterCardsInPlay(card => card.isMatch({ type: 'character', kneeled: false }));
        const costs = characters.map(card => card.getPrintedCost());
        return Math.min(...costs);
    }

    kneelCharacter(player) {
        this.game.resolveGameAction(
            GameActions.kneelCard({ card: this.context.target })
        );

        this.game.addMessage('{0} plays {1} and pays {2} gold to kneel {3}',
            player, this, this.context.xValue, this.context.target);

        return true;
    }

    takeControl(player) {
        this.game.takeControl(player, this.context.target);

        this.game.addMessage('{0} plays {1} and pays {2} gold to take control of {3}',
            player, this, this.context.xValue, this.context.target);

        return true;
    }
}

Bribery.code = '15045';

module.exports = Bribery;
