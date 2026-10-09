import DrawCard from '../../drawcard.js';

class KingsmootClaimant extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.isAttacking() &&
                !this.game.currentChallenge.defendingPlayer.anyCardsInPlay(
                    (card) => card.getType() === 'character' && card.hasTrait('King')
                ),
            match: this,
            effect: [ability.effects.addTrait('King'), ability.effects.addKeyword('Renown')]
        });
    }
}

KingsmootClaimant.code = '27003';

export default KingsmootClaimant;
