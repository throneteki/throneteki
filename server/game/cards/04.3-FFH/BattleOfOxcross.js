import PlotCard from '../../plotcard.js';

class BattleOfOxcross extends PlotCard {
    // Battle of Oxcross (04060)
    // Each character with printed cost 4 or higher cannot be declared as a defender during the
    // first challenge you initiate this round.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game.isDuringChallenge({ attackingPlayer: this.controller, number: 1 }),
            match: (card) => card.getType() === 'character' && card.getPrintedCost() >= 4,
            targetController: 'opponent',
            effect: ability.effects.cannotBeDeclaredAsDefender()
        });
    }
}

BattleOfOxcross.code = '04060';

export default BattleOfOxcross;
