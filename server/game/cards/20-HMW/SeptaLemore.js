const DrawCard = require('../../drawcard');

class SeptaLemore extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Aegon Targaryen',
            effect: ability.effects.addKeyword('Insight')
        });
        
        this.interrupt({
            when: {
                onCardLeftPlay: event => event.card === this
            },
            target: {
                cardCondition: (card, context) => card.location === 'play area' && card.getType() === 'character' && card.isShadow() && card.controller === context.player
            },
            handler: context => {
                context.player.moveCard(context.target, 'shadows');
                this.game.addMessage('{0} uses {1} to return {2} to shadows', context.player, this, context.target);
            }
        });
    }
}

SeptaLemore.code = '20032';

module.exports = SeptaLemore;
