const DrawCard = require('../../../drawcard.js');

class TheTwins extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge && 
                this.game.currentChallenge.attackingPlayer === this.controller && 
                this.controller.getNumberOfChallengesInitiated() === 3 &&
                this.hasAttackingFrey()),
            match: card => card === this.controller.activePlot,
            effect: ability.effects.modifyClaim(1)
        });
    }

    hasAttackingFrey() {
        return this.controller.anyCardsInPlay(card => this.game.currentChallenge.isAttacking(card) &&
                                                      card.hasTrait('House Frey') && 
                                                      card.getType() === 'character');
    }
}

TheTwins.code = '06058';

module.exports = TheTwins;
