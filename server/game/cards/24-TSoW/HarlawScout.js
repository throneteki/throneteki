const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class HarlawScout extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                'onCardDiscarded:aggregate': event => event.events.some(discardEvent => (discardEvent.source === 'reserve'))
            },
            message: '{player} uses {source} to gain 1 gold',
            gameAction: GameActions.gainGold(context => ({ player: context.player, amount: 1 }))
        });
    }
}

HarlawScout.code = '24005';

module.exports = HarlawScout;
