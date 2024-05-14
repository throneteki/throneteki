const DrawCard = require('../../drawcard.js');

class Val extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onDeclaredAsAttacker: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'hand' &&
                    card.controller === this.controller &&
                    card.getType() === 'character' &&
                    card.hasTrait('Wildling') &&
                    card.getPrintedCost() <= 4 &&
                    this.controller.canPutIntoPlay(card)
            },
            handler: (context) => {
                context.player.putIntoPlay(context.target, 'play', { kneeled: true });
                this.game.currentChallenge.addAttacker(context.target);

                this.game.addMessage(
                    '{0} uses {1} to put {2} into play from their hand knelt, participating as an attacker',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

Val.code = '10039';

module.exports = Val;
