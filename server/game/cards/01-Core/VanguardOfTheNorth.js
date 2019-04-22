const DrawCard = require('../../drawcard.js');

class VanguardOfTheNorth extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.isDuringChallenge({ challengeType: 'military' }) &&
                this.game.getPlayers().some(player => player.activePlot && player.activePlot.hasTrait('War'))
            ),
            match: this,
            effect: ability.effects.doesNotKneelAsAttacker()
        });
    }
}

VanguardOfTheNorth.code = '01151';

module.exports = VanguardOfTheNorth;
