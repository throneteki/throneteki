const DrawCard = require('../../drawcard.js');

class TheUsurper extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Lord' });

        this.whileAttached({
            condition: () => !this.anyOpponentControlsKing(),
            effect: [
                ability.effects.addTrait('King'),
                ability.effects.addKeyword('renown')
            ]
        });

        this.whileAttached({
            condition: () => this.anyOpponentControlsKing(),
            effect: ability.effects.modifyStrength(4)
        });
    }

    anyOpponentControlsKing() {
        return this.game.getPlayers().some(player => {
            if(player === this.controller) {
                return false;
            }

            return player.anyCardsInPlay(card => card.getType() === 'character' && card.hasTrait('King'));
        });
    }
}

TheUsurper.code = '25510';
TheUsurper.version = '1.0';

module.exports = TheUsurper;
