const DrawCard = require('../../drawcard.js');

class Silence extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: 2
        });
        this.action({
            title:'Put card into play',
            phase: 'challenge',
            cost: [
                ability.costs.kneelSelf()
            ],
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: card => card.getType() === 'location' && card.location === 'hand' && card.hasTrait('Warship') && this.controller.canPutIntoPlay(card)

            },
            handler: context => {
                var wasStand = false;
                var euron = this.controller.cardsInPlay.find(card => card.name === 'Euron Crow\'s Eye');
                context.player.putIntoPlay(context.target);
                if(euron && euron.kneeled && euron.allowGameAction('stand')) {
                    this.controller.standCard(euron);
                    wasStand = true;
                }
                if(wasStand === true) {
                    this.game.addMessage('{0} uses {1} to put {2} into play and stand {3}', this.controller, this, context.target, euron);
                    return;
                }

                this.game.addMessage('{0} uses {1} to put {2} into play', this.controller, this, context.target);
            }
        });
    }
}

Silence.code = '12016';

module.exports = Silence;
