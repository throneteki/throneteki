import DrawCard from '../../drawcard.js';

class RedRonnet extends DrawCard {
    // Red Ronnet (11107)
    // No attachments except Weapon.
    // While Red Ronnet is attacking, if the defending player controls a card in shadows, raise the
    // claim value on your revealed plot card by 1.
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
