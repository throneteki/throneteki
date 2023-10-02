const DrawCard = require('../../drawcard.js');

class TrystaneMartell extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this
            },
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => (
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getNumberOfIcons() === 0)
            },
            handler: context => {
                context.target.controller.returnCardToHand(context.target);
                this.game.addMessage('{0} uses {1} to return {2} to {3}\'s hand',
                    context.player, this, context.target, context.target.controller);
            }
        });
    }
}

TrystaneMartell.code = '22010';

module.exports = TrystaneMartell;
