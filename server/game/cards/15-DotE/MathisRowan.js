const DrawCard = require('../../drawcard.js');

class MathisRowan extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give control of card',
            limit: ability.limit.perRound(1),
            chooseOpponent: () => true,
            target: {
                type: 'select',
                cardCondition: card => card.location === 'play area' && card.controller === this.controller &&
                                       ['character', 'attachment', 'location'].includes(card.getType())
            },
            handler: context => {
                this.lastingEffect(ability => ({
                    match: context.target,
                    effect: ability.effects.takeControl(context.opponent)
                }));
                this.game.addMessage('{0} uses {1} to give {2} control of {3}',
                    this.controller, this, context.opponent, context.target);
                if(this.controller.canGainGold()) {
                    this.game.addGold(this.controller, 2);
                    this.game.addMessage('Then {0} gains 2 gold',
                        this.controller);
                }
            }
        });
    }
}

MathisRowan.code = '15037';

module.exports = MathisRowan;
