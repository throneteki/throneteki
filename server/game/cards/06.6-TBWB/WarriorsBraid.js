const DrawCard = require('../../drawcard.js');

class WarriorsBraid extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addKeyword('renown'),
                ability.effects.dynamicStrength(() => this.tokens['bell'])
            ]
        });
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.challengeType === 'military' && event.challenge.winner === this.controller &&
                                         event.challenge.isParticipating(this.parent)
            },
            handler: () => {
                this.addToken('bell', 1);
                this.game.addMessage('{0} places 1 bell token on {1}', this.controller, this);
            }
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || !card.isFaction('targaryen')) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

WarriorsBraid.code = '06114';

module.exports = WarriorsBraid;
