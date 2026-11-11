import DrawCard from '../../drawcard.js';

class KingsmootClaimant extends DrawCard {
    // Kingsmoot Claimant (27003)
    // While Kingsmoot Claimant is attacking an opponent who does not control a King character, it
    // gains the King trait and renown.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.source.isAttacking() &&
                !context.game.currentChallenge.defendingPlayer.anyCardsInPlay(
                    (card) => card.getType() === 'character' && card.hasTrait('King')
                ),
            match: this,
            effect: [ability.effects.addTrait('King'), ability.effects.addKeyword('Renown')]
        });
    }
}

KingsmootClaimant.code = '27003';

export default KingsmootClaimant;
