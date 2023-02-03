const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class KingsLandingMob extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetController: 'current',
            effect: [
                ability.effects.reduceSelfCost('marshal', () => this.controller.getTotalReserve()),
                ability.effects.setMinCost(1)
            ]
        });
        this.reaction({
            when: {
                onCardKneeled: event => event.cause === 'assault'
            },
            cost: ability.costs.killSelf(),
            message: {
                format: '{player} kills {source} to remove {assaulted} from the game',
                args: { assaulted: context => context.event.card }
            },
            gameAction: GameActions.removeFromGame(context => ({ card: context.event.card, player: context.player }))
        });
    }
}

KingsLandingMob.code = '24025';

module.exports = KingsLandingMob;
