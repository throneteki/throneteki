import DrawCard from '../../drawcard.js';

class TheTwins extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game.isDuringChallenge({ attackingPlayer: this.controller, number: 3 }) &&
                this.hasAttackingFrey(),
            match: (card) => card === this.controller.activePlot,
            effect: ability.effects.modifyClaim(1)
        });
    }

    hasAttackingFrey() {
        return this.controller.anyCardsInPlay(
            (card) =>
                card.isAttacking() && card.hasTrait('House Frey') && card.getType() === 'character'
        );
    }
}

TheTwins.code = '06058';

export default TheTwins;
