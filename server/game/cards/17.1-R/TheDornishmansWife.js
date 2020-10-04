const DrawCard = require('../../drawcard.js');
const TextHelper = require('../../TextHelper');

class TheDornishmansWife extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharacterKilled: event => event.card.isUnique()
            },
            max: ability.limit.perPhase(1),
            handler: context => {
                let bonusMessage = [];

                if(context.event.card.hasIcon('military') && this.controller.canGainGold()) {
                    let gold = this.game.addGold(this.controller, 2);
                    bonusMessage.push('gain {0} gold', gold);
                }
                
                if(context.event.card.hasIcon('intrigue') && this.controller.canDraw()) {
                    let cards = this.controller.drawCardsToHand(2);
                    bonusMessage.push('draw {0}', TextHelper.count(cards, 'card'));
                }
                                    
                if(context.event.card.hasIcon('power') && context.event.card.canGainPower()) {
                    context.event.card.modifyPower(2);
                    bonusMessage.push('to have {0} gain 2 power', context.event.card);
                }

                this.game.addMessage('{0} uses {1} to {2}', this.controller, this, bonusMessage);
            }
        });
    }
}

TheDornishmansWife.code = '17145';

module.exports = TheDornishmansWife;
