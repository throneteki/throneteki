import PlotCard from '../../plotcard.js';

class DesperateAttack extends PlotCard {
    // Desperate Attack (14050)
    // While you are the defending player, raise the claim value on the attacking player's revealed
    // plot card by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.game.isDuringChallenge({ defendingPlayer: context.source.controller }),
            match: (card, context) =>
                card === context.game.currentChallenge.attackingPlayer.activePlot,
            targetController: 'any',
            effect: ability.effects.modifyClaim(1)
        });
    }
}

DesperateAttack.code = '14050';

export default DesperateAttack;
