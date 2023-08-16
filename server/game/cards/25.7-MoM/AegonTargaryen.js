const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class AegonTargaryen extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: event => this.game.currentPhase === 'challenge' && event.card.isMatch({ type: 'character', loyal: false, faction: 'targaryen' })
            },
            limit: ability.limit.perPhase(2),
            message: '{player} uses {source} to stand {source}',
            gameAction: GameActions.standCard({ card: this })
        });
    }
}

AegonTargaryen.code = '25573';
AegonTargaryen.version = '1.0';

module.exports = AegonTargaryen;
