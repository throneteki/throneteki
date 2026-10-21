import DrawCard from '../../drawcard.js';

class TheTwins extends DrawCard {
    // The Twins (06058)
    // During the third challenge you initiate each phase, if you control an attacking House Frey
    // character, raise the claim value on your revealed plot card by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.game.isDuringChallenge({
                    attackingPlayer: context.source.controller,
                    number: 3
                }) && context.source.hasAttackingFrey(),
            match: (card, context) => card === context.source.controller.activePlot,
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
