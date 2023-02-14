const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class SalladhorSaansLyseni extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCardKneeled: event => event.card.getType() === 'location' && event.card.controller !== this.controller && event.card.controller.faction.power > 0 // TODO: Clean up kneeling to always identify if it is a card effect or not (eg. setting a cause where appropriate)
            },
            target: {
                cardCondition: { type: 'character', location: 'play area' }
            },
            limit: ability.limit.perRound(1),
            message: {
                format: '{player} uses {source} to move 1 power from {controller}\'s faction card to {target}',
                args: { controller: context => context.event.card.controller }
            },
            handler: context => {
                this.game.resolveGameAction(GameActions.movePower(context => ({ from: context.event.card.controller.faction, to: context.target, amount: 1 })), context);
            }
        });
    }
}

SalladhorSaansLyseni.code = '24001';

module.exports = SalladhorSaansLyseni;
