const DrawCard = require('../../drawcard.js');

class TraitorToTheCrown extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.doesNotContributeToDominance()
        });

        this.whileAttached({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.challengeType === 'power',
            effect: ability.effects.doesNotContributeStrength()
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || card.controller === this.controller) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

TraitorToTheCrown.code = '08009';

module.exports = TraitorToTheCrown;
