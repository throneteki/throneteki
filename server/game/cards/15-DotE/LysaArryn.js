const DrawCard = require('../../drawcard.js');

class LysaArryn extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: event => event.card === this
            },
            target: {
                cardCondition: card => card.location === 'play area' && card !== this && 
                                       ['character', 'attachment', 'location'].includes(card.getType())
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to remove {2} from the game', this.controller, this, context.target);
                this.lastingEffect(ability => ({
                    targetController: 'any',
                    match: context.target,
                    targetLocation: ['play area', 'out of game'],
                    effect: ability.effects.removeFromGame()
                }));
            }
        });
    }
}

LysaArryn.code = '15039';

module.exports = LysaArryn;
