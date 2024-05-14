const DrawCard = require('../../drawcard.js');

class OverthrowingTheMasters extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Remove character from challenge',
            condition: () => this.game.isDuringChallenge({ attackingPlayer: this.controller }),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isDefending() &&
                    card.getStrength() <= this.game.currentChallenge.defendingPlayer.deadPile.length
            },
            handler: (context) => {
                this.game.currentChallenge.removeFromChallenge(context.target);
                this.game.addMessage(
                    '{0} plays {1} to remove {2} from the challenge',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

OverthrowingTheMasters.code = '06094';

module.exports = OverthrowingTheMasters;
