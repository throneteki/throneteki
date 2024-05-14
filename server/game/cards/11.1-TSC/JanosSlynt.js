const DrawCard = require('../../drawcard');

class JanosSlynt extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.controller === this.controller &&
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isFaction('thenightswatch'),
                gameAction: 'sacrifice'
            },
            handler: (context) => {
                this.controller.sacrificeCard(context.target);
                this.game.addMessage(
                    '{0} is forced by {1} to sacrifice {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

JanosSlynt.code = '11006';

module.exports = JanosSlynt;
