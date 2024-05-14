const DrawCard = require('../../drawcard.js');

class MyrcellaBaratheon extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.areNoKingsInPlay(),
            match: this,
            effect: ability.effects.doesNotKneelAsDefender({ challengeType: 'power' })
        });

        this.persistentEffect({
            condition: () => this.areNoKingsInPlay(),
            match: this,
            effect: ability.effects.addKeyword('Renown')
        });
    }

    areNoKingsInPlay() {
        return !this.game.getPlayers().some((player) => {
            return player.anyCardsInPlay(
                (card) => card.getType() === 'character' && card.hasTrait('King')
            );
        });
    }
}

MyrcellaBaratheon.code = '04095';

module.exports = MyrcellaBaratheon;
