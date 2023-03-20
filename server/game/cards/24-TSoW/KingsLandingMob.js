const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class KingsLandingMob extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardKneeled: event => event.reason === 'assault'
            },
            cost: [
                ability.costs.killSelf(),
                ability.costs.sacrifice(card => card.getType() === 'location')
            ],
            message: {
                format: '{player} kills {costs.kill} and sacrifices {costs.sacrifice} to discard {assaulted} from play',
                args: { assaulted: context => context.event.card }
            },
            gameAction: GameActions.discardCard(context => ({ card: context.event.card }))
        });
    }
}

KingsLandingMob.code = '24025';

module.exports = KingsLandingMob;
