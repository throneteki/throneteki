import DrawCard from '../../drawcard.js';

class TheTwins extends DrawCard {
    // The Twins (06058)
    // During the third challenge you initiate each phase, if you control an attacking House Frey
    // character, raise the claim value on your revealed plot card by 1.
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
