const DrawCard = require('../../drawcard.js');

class DragonSkull extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'targaryen' });
        this.whileAttached({
            condition: () => this.areNoDragonsInPlay(),
            effect: [ability.effects.addKeyword('Intimidate'), ability.effects.addKeyword('Renown')]
        });
    }

    areNoDragonsInPlay() {
        return !this.game.getPlayers().some((player) => {
            return player.anyCardsInPlay(
                (card) => card.getType() === 'character' && card.hasTrait('Dragon')
            );
        });
    }
}

DragonSkull.code = '13074';

module.exports = DragonSkull;
