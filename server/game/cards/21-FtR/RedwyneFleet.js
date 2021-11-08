const DrawCard = require('../../drawcard.js');

class RedwyneFleet extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.name === 'Paxter Redwyne',
            effect: [
                ability.effects.addTrait('Commander'),
                ability.effects.addIcon('military'),
                ability.effects.addIcon('power')
            ]
        });
        
        this.reaction({
            when: {
                onCardKneeled: (event, context) => event.card.hasTrait('House Redwyne') && event.card.controller === context.player
            },
            limit: ability.limit.perRound(3),
            condition: context => context.player.canGainGold(),
            handler: context => {
                this.game.addGold(context.player, 1);
                this.game.addMessage('{0} uses {1} to gain 1 gold', context.player, this);
            }
        });
    }
}

RedwyneFleet.code = '21022';

module.exports = RedwyneFleet;
