const DrawCard = require('../../drawcard.js');

class MareInHeat extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Knight' });
        this.action({
            title: 'Remove character from challenge',
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isParticipating(this.parent) &&
                             this.hasSingleParticipatingChar(),
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: card => card.getType() === 'character' && card.location === 'play area' &&
                                       this.game.currentChallenge.isParticipating(card) &&
                                       card.getStrength() > this.parent.getStrength()
            },
            handler: context => {
                this.game.currentChallenge.removeFromChallenge(context.target);
                this.game.addMessage('{0} kneels {1} to remove {2} from the challenge', this.controller, this, context.target);
            }
        });
    }

    hasSingleParticipatingChar() {
        if(this.game.currentChallenge.attackingPlayer === this.controller) {
            return this.game.currentChallenge.attackers.length === 1;
        }
        return this.game.currentChallenge.defenders.length === 1;
    }
}

MareInHeat.code = '02044';

module.exports = MareInHeat;
