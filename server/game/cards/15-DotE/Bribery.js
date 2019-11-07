const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class Bribery extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            cost: ability.costs.payXGold(() => 0, () => 99),
            target: {
                cardCondition: (card, context) => card.location === 'play area' && card.getType() === 'character' && card.getPrintedCost() <= context.xValue,
                gameAction: 'kneel'
            },
            handler: context => {
                this.targetCharacter = context.target;
                if(this.targetCharacter.hasTrait('Ally') || this.targetCharacter.hasTrait('Mercenary')) {
                    let buttons = [
                        { text: 'Kneel', method: 'kneelCharacter' },
                        { text: 'Take control', method: 'takeControl' }
                    ];
            
                    this.game.promptWithMenu(this.controller, this, {
                        activePrompt: {
                            menuTitle: 'Take control of character?',
                            buttons: buttons
                        },
                        source: this
                    });
                } else {
                    this.kneelCharacter(this.controller);
                }
            }
        });
    }

    kneelCharacter(player) {
        if(!this.targetCharacter) {
            return false;
        }

        this.game.resolveGameAction(
            GameActions.kneelCard({ card: this.targetCharacter })
        );

        this.game.addMessage('{0} uses {1} to kneel {2}',
            player, this, this.targetCharacter);
        this.targetCharacter = null;

        return true;
    }

    takeControl(player) {
        if(!this.targetCharacter) {
            return false;
        }

        this.game.takeControl(player, this.targetCharacter);

        this.game.addMessage('{0} uses {1} to take control of {2}',
            player, this, this.targetCharacter);
        this.targetCharacter = null;

        return true;
    }
}

Bribery.code = '15045';

module.exports = Bribery;
