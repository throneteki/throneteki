const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class KingsLandingMob extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.ignoresAssaultLocationCost()
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
