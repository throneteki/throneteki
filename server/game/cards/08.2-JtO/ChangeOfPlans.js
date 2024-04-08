const DrawCard = require('../../drawcard.js');

class ChangeOfPlans extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.loser === this.controller && this.controller.getNumberOfUsedPlots() < 5
            },
            target: {
                type: 'select',
                activePromptTitle: 'Select a plot',
                cardCondition: card => card.location === 'plot deck' && card.controller === this.controller,
                cardType: 'plot'
            },
            handler: context => {
                context.player.moveCard(context.target, 'revealed plots', { bottom: true });
                this.game.addMessage('{0} plays {1} to place {2} on the bottom of their used pile',
                    context.player, this, context.target);
            }
        });
    }
}

ChangeOfPlans.code = '08036';

module.exports = ChangeOfPlans;
