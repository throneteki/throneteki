import DrawCard from '../../drawcard.js';

class RedRonnet extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.isAttacking() &&
                this.game.isDuringChallenge({
                    match: (challenge) => challenge.defendingPlayer.shadows.length > 0
                }),
            match: (card) => card === this.controller.activePlot,
            effect: ability.effects.modifyClaim(1)
        });
    }
}

RedRonnet.code = '11107';

export default RedRonnet;
