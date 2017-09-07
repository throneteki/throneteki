const PlotCard = require('../../plotcard.js');

class ForTheWatch extends PlotCard {
    setupCardAbilities(ability) {
        // TODO: This effect will need to be reworked for Melee, as it currently
        // checks how many challenges the attacker has made, not how many have
        // been initiated against the defending player.
        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.defendingPlayer === this.controller &&
                this.game.currentChallenge.number <= 1
            ),
            targetType: 'player',
            targetController: 'opponent',
            effect: ability.effects.cannotWinChallenge()
        });
    }
}

ForTheWatch.code = '02067';

module.exports = ForTheWatch;
