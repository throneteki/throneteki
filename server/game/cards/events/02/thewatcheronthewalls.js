const DrawCard = require('../../../drawcard.js');

class TheWatcherOnTheWalls extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel 2 Rangers to kill attackers',
            phase: 'challenge',
            condition: () => this.game.currentChallenge && this.game.currentChallenge.challengeType === 'military',
            cost: ability.costs.kneelMultiple(2, card => card.getType() === 'character' && card.hasTrait('Ranger')),
            handler: () => {
                this.game.killCharacters(this.game.currentChallenge.attackers);
                this.game.addMessage('{0} uses {1} to kill each attacking character',
                    this.controller, this);
            }
        });
    }
}

TheWatcherOnTheWalls.code = '02066';

module.exports = TheWatcherOnTheWalls;
