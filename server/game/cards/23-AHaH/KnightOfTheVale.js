const DrawCard = require('../../drawcard.js');

class KnightOfTheVale extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: 1
        });
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ defendingPlayer: this.controller }) &&
                this.game.currentChallenge.attackingPlayer.getTotalInitiative() > this.controller.getTotalInitiative(),
            match: this,
            effect: ability.effects.doesNotKneelAsDefender()
        });
    }
}

KnightOfTheVale.code = '23030';

module.exports = KnightOfTheVale;
