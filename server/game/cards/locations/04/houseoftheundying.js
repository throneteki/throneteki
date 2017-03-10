const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class HouseOfTheUndying extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Control opponent\'s dead characters',
            method: 'controlDeadCharacters',
            phase: 'challenge'
        });
    }

    controlDeadCharacters() {
        this.controller.moveCard(this, 'out of game');

        var opponent = this.game.getOtherPlayer(this.controller);

        if(!opponent) {
            return;
        }

        var eligibleCharacters = opponent.deadPile.filter(card => {
            if(!card.isUnique()) {
                return true;
            }

            return opponent.deadPile.filter(c => c.name === card.name).length === 1;
        });

        _.each(eligibleCharacters, card => {
            this.controller.putIntoPlay(card);
            this.atEndOfPhase(ability => ({
                match: card,
                effect: ability.effects.moveToDeadPileIfStillInPlay()
            }));
        });

        this.game.addMessage('{0} removes {1} from the game to control {2}', this.controller, this, eligibleCharacters);
    }
}

HouseOfTheUndying.code = '04114';

module.exports = HouseOfTheUndying;
