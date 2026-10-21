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
            condition: (context) =>
                context.game.currentChallenge &&
                context.game.currentChallenge.isAttacking(context.source.parent) &&
                context.source.hasLessTotalPower(context.game.currentChallenge.defendingPlayer),
            match: (card, context) => card === context.source.controller.activePlot,
            effect: ability.effects.modifyClaim(1)
        });
    }

    hasLessTotalPower(opponent) {
        return this.controller.getTotalPower() < opponent.getTotalPower();
    }
}

KingBeyondTheWall.code = '04079';

export default KingBeyondTheWall;
