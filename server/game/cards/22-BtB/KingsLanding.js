const DrawCard = require('../../drawcard.js');

class KingsLanding extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain 1 gold',
            phase: 'marshal',
            condition: () => this.controller.canGainGold(),
            limit: ability.limit.perPhase(2),
            cost: ability.costs.kneel(card => card.location === 'play area' && 
                card.controller === this.controller &&
                card.getType() === 'location' && 
                card.hasTrait('King\'s Landing')),
            handler: context => {
                this.game.addGold(context.player, 1);
                this.game.addMessage('{0} uses {1} and kneels {2} to gain 1 gold', context.player, this, context.costs.kneel);
            }
        });
        
        this.reaction({
            when: {
                onCardEntersPlay: event => this.controller.canDraw() && 
                    event.card.controller === this.controller && 
                    event.card.getType() === 'location' && 
                    event.card.hasTrait('King\'s Landing')
            },
            limit: ability.limit.perRound(2),
            cost: ability.costs.kneelSpecific(context => context.event.card),
            handler: context => {
                context.player.drawCardsToHand(1);
                this.game.addMessage('{0} uses {1} and kneels {2} to draw 1 card', context.player, this, context.card);
            }
        });
    }
}

KingsLanding.code = '22026';

module.exports = KingsLanding;
