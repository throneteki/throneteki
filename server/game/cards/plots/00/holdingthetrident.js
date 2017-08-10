const PlotCard = require('../../../plotcard.js');

class HoldingTheTrident extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controlsFewerCharactersThanOpponent(),
            match: card => card.getType() === 'character',
            effect: ability.effects.modifyStrength(2)
        });
    }

    controlsFewerCharactersThanOpponent() {
        let numOwnChars = this.controller.getNumberOfCardsInPlay(card => card.getType() === 'character');
        let opponent = this.game.getOtherPlayer(this.controller);

        if(!opponent) {
            return false;
        }

        let numOpponentChars = opponent.getNumberOfCardsInPlay(card => card.getType() === 'character');

        return numOwnChars < numOpponentChars;
    }
}

HoldingTheTrident.code = '00020';

module.exports = HoldingTheTrident;
