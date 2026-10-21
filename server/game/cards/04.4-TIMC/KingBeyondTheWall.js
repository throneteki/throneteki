import DrawCard from '../../drawcard.js';

class KingBeyondTheWall extends DrawCard {
    // King Beyond the Wall (04079)
    // Wildling character only.
    // Attached character gains the King trait.
    // While attached character is attacking a player with a higher power total than you, raise the
    // claim value on your revealed plot card by 1.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Wildling' });
        this.whileAttached({
            effect: ability.effects.addTrait('King')
        });

        this.persistentEffect({
            condition: () =>
                this.game.currentChallenge &&
                this.game.currentChallenge.isAttacking(this.parent) &&
                this.hasLessTotalPower(this.game.currentChallenge.defendingPlayer),
            match: (card) => card === this.controller.activePlot,
            effect: ability.effects.modifyClaim(1)
        });
    }

    hasLessTotalPower(opponent) {
        return this.controller.getTotalPower() < opponent.getTotalPower();
    }
}

KingBeyondTheWall.code = '04079';

export default KingBeyondTheWall;
