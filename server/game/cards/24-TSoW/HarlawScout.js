const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class HarlawScout extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                'onCardDiscarded:aggregate': event => event.events.some(discardEvent => (discardEvent.source === 'reserve'))
            },
            limit: ability.limit.perRound(2),
            message: '{player} uses {source} to gain 1 gold',
            gameAction: GameActions.gainGold(context => ({ player: context.player, amount: 1 }))
        });
    }
}

HarlawScout.code = '24005';

module.exports = HarlawScout;
