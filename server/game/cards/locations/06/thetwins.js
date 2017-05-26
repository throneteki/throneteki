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
        let cards = this.controller.filterCardsInPlay(card => {
            return (this.game.currentChallenge.isAttacking(card) &&
                    card.hasTrait('House Frey') && 
                    card.getType() === 'character');
        });

        return !!cards.length;
    }
}

TheTwins.code = '06058';

module.exports = TheTwins;
