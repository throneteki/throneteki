const DrawCard = require('../../../drawcard.js');

class OverthrowingTheMasters extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Remove character from challenge',
            condition: () => this.game.currentChallenge && this.game.currentChallenge.attackingPlayer === this.controller,
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' &&
                                       this.game.currentChallenge.isDefending(card) && 
                                       card.getStrength() <= this.game.currentChallenge.defendingPlayer.deadPile.size()
            },
            handler: context => {
                this.game.currentChallenge.removeFromChallenge(context.target);
                this.game.addMessage('{0} plays {1} to remove {2} from the challenge', this.controller, this, context.target);
            }
        });
    }
}

OverthrowingTheMasters.code = '06094';

module.exports = OverthrowingTheMasters;
