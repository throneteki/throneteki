const _ = require('underscore');
const DrawCard = require('../../../drawcard.js');

class MyrcellaBaratheon extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                !this.getKingsInPlay() &&
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'power'),
            match: this,
            effect: ability.effects.doesNotKneelAsDefender()
        });

        this.persistentEffect({
            condition: () => !this.getKingsInPlay(),
            match: this,
            effect: ability.effects.addKeyword('Renown')
        });
    }

    getKingsInPlay() {
        var cards = _.each(this.game.getPlayers(), player => {
            player.cardsInPlay.filter(card => {
                card.getType() === 'character' && 
                card.hasTrait('King');
            });
        });

        return cards;
    }
}

MyrcellaBaratheon.code = '04095';

module.exports = MyrcellaBaratheon;
