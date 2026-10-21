import DrawCard from '../../drawcard.js';

class PalaceSpearman extends DrawCard {
    // Palace Spearman (01114)
    // No attachments.
    // While you are not the first player, Palace Spearman gains an [intrigue] icon.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game.currentPhase !== 'setup' &&
                this.game.currentPhase !== 'plot' &&
                !this.controller.firstPlayer,
            match: this,
            effect: ability.effects.addIcon('intrigue')
        });
    }
}

PalaceSpearman.code = '01114';

export default PalaceSpearman;
