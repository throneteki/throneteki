const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class HouseOfTheUndying extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Take control of opponent\'s dead characters',
            phase: 'challenge',
            cost: ability.costs.removeSelfFromGame(),
            handler: context => this.controlDeadCharacters(context.player)
        });
    }

    controlDeadCharacters(currentController) {
        let opponent = this.game.getOtherPlayer(currentController);
        if(!opponent) {
            return;
        }

        let eligibleCharacters = opponent.deadPile.filter(card => {
            if(!card.isUnique()) {
                return true;
            }

            return opponent.deadPile.filter(c => c.name === card.name).length === 1;
        });

        _.each(eligibleCharacters, card => {
            currentController.putIntoPlay(card);
            this.atEndOfPhase(ability => ({
                match: card,
                effect: ability.effects.moveToDeadPileIfStillInPlay()
            }));
        });

        this.game.addMessage('{0} removes {1} from the game to take control {2}',
            currentController, this, eligibleCharacters);
    }
}

HouseOfTheUndying.code = '04114';

module.exports = HouseOfTheUndying;
