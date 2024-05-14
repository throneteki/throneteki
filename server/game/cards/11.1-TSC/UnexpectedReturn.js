const DrawCard = require('../../drawcard');

class UnexpectedReturn extends DrawCard {
    setupCardAbilities() {
        this.action({
            phase: 'challenge',
            title: 'Put character into play',
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.location === 'discard pile' &&
                    card.controller === this.controller
            },
            handler: (context) => {
                this.controller.putIntoPlay(context.target);
                this.game.addMessage(
                    '{0} uses {1} to put {2} into play',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

UnexpectedReturn.code = '11015';

module.exports = UnexpectedReturn;
