const DrawCard = require('../../drawcard.js');

class WarriorsBraid extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'targaryen' });
        this.whileAttached({
            effect: [
                ability.effects.addKeyword('renown'),
                ability.effects.dynamicStrength(() => this.tokens['bell'])
            ]
        });
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.challengeType === 'military' && event.challenge.winner === this.controller &&
                                         event.challenge.isAttacking(this.parent)
            },
            handler: () => {
                this.modifyToken('bell', 1);
                this.game.addMessage('{0} places 1 bell token on {1}', this.controller, this);
            }
        });
    }
}

WarriorsBraid.code = '06114';

module.exports = WarriorsBraid;
