const DrawCard = require('../../drawcard.js');

class CompelledByTheKing extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'dominance'
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === this.controller &&
                    card.kneeled,
                gameAction: 'stand'
            },
            handler: (context) => {
                context.target.controller.standCard(context.target);
                this.game.addMessage(
                    '{0} plays {1} to stand {2}',
                    this.controller,
                    this,
                    context.target
                );
                this.game.once('onDominanceDetermined', (event) =>
                    this.resolveOnDominanceDetermined(event.winner, context.target)
                );
            }
        });
    }

    resolveOnDominanceDetermined(winner, target) {
        if (winner !== this.controller) {
            return false;
        }

        target.modifyPower(1);
        this.game.addMessage(
            '{0} gains 1 power on {1} because of {2}',
            this.controller,
            target,
            this
        );
    }
}

CompelledByTheKing.code = '00009';

module.exports = CompelledByTheKing;
