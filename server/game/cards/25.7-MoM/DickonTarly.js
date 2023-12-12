const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class DickonTarly extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardStood: event => event.card.controller === this.controller && event.card.isFaction('tyrell')
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to stand {source}',
            gameAction: GameActions.standCard({ card: this })
        });
    }
}

DickonTarly.code = '25588';
DickonTarly.version = '1.1';

module.exports = DickonTarly;
