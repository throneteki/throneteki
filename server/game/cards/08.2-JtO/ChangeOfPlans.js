const DrawCard = require('../../drawcard.js');

class ChangeOfPlans extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.loser === this.controller && this.controller.getNumberOfUsedPlots() < 5
            },
            target: {
                activePromptTitle: 'Select a plot',
                cardCondition: card => ['plot deck', 'scheme plots'].includes(card.location) && card.controller === this.controller,
                cardType: 'plot'
            },
            handler: context => {
                context.player.moveCard(context.target, 'revealed plots', { bottom: true });
                this.game.addMessage('{0} plays {1} to move {2} to the bottom of their used pile',
                    context.player, this, context.target);
            }
        });
    }
}

ChangeOfPlans.code = '08036';

module.exports = ChangeOfPlans;
