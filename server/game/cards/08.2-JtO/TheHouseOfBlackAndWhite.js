const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class TheHouseOfBlackAndWhite extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kill character',
            phase: 'dominance',
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.discardXGold(() => this.getMinimumDiscardGoldAmount(), () => 99)
            ],
            target: {
                cardCondition: (card, context) => card.location === 'play area' && card.getType() === 'character' &&
                                                  (context.xValue ? (card.getPrintedStrength() <= context.xValue) : (card.getPrintedStrength() <= this.tokens.gold))
            },
            handler: context => {
                this.game.killCharacter(context.target);
                this.game.addMessage('{0} kneels and discards {1} gold from {2} to kill {3}',
                    context.player, context.xValue, this, context.target);
                
                if(context.player.gold > 0) {
                    let range = _.range(1, context.player.gold + 1).reverse();
            
                    let buttons = _.map(range, gold => {
                        return { text: gold.toString(), method: 'moveGold', arg: gold };
                    });
                    buttons.push({ text: 'Done', method: 'moveGold', arg: 0 });
            
                    this.game.promptWithMenu(context.player, this, {
                        activePrompt: {
                            menuTitle: 'Select gold amount to move to ' + this.name,
                            buttons: buttons
                        },
                        source: this
                    });
                }
            }
        });
    }

    moveGold(player, gold) {
        if(gold === 0) {
            return true;
        }

        this.game.addGold(player, -gold);
        this.modifyToken('gold', gold);
        this.game.addMessage('{0} moves {1} gold to {2}', player, gold, this);

        return true;
    }

    getMinimumDiscardGoldAmount() {
        let characters = this.game.filterCardsInPlay(card => card.getType() === 'character');
        let characterPrintedStrengths = _.map(characters, card => card.getPrintedStrength());
        let lowestStrength = _.min(characterPrintedStrengths);

        return _.max([lowestStrength, 1]);
    }
}

TheHouseOfBlackAndWhite.code = '08022';

module.exports = TheHouseOfBlackAndWhite;
