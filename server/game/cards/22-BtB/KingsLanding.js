const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class KingsLanding extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain 1 gold',
            phase: 'marshal',
            limit: ability.limit.perPhase(2),
            cost: ability.costs.kneel(card => card.location === 'play area' &&
                card.controller === this.controller &&
                card.getType() === 'location' &&
                card.hasTrait('King\'s Landing')),
            message: {
                format: '{player} uses {source} and kneels {kneeled} to gain 1 gold',
                args: { kneeled: context => context.costs.kneel }
            },
            gameAction: GameActions.gainGold(context => ({ player: context.player, amount: 1 }))
        });

        this.reaction({
            when: {
                onCardEntersPlay: event => event.card.controller === this.controller &&
                    event.card.getType() === 'location' &&
                    event.card.hasTrait('King\'s Landing')
            },
            limit: ability.limit.perRound(2),
            cost: ability.costs.kneelSpecific(context => context.event.card),
            message: {
                format: '{player} uses {source} and kneels {kneeled} to draw 1 card',
                args: { kneeled: context => context.costs.kneel }
            },
            gameAction: GameActions.drawCards(context => ({ player: context.player, amount: 1 }))
        });
    }
}

KingsLanding.code = '22026';

module.exports = KingsLanding;
