import PlotCard from '../../plotcard.js';

class DesperateAttack extends PlotCard {
    // Desperate Attack (14050)
    // While you are the defending player, raise the claim value on the attacking player's revealed
    // plot card by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ defendingPlayer: this.controller }),
            match: (card) => card === this.game.currentChallenge.attackingPlayer.activePlot,
            targetController: 'any',
            effect: ability.effects.modifyClaim(1)
        });
    }
}

DesperateAttack.code = '14050';

export default DesperateAttack;
