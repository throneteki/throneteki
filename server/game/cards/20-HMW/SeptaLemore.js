const DrawCard = require('../../drawcard');

class SeptaLemore extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Aegon Targaryen',
            effect: ability.effects.addKeyword('Insight')
        });

        this.interrupt({
            when: {
                onCardLeftPlay: (event) => event.card === this
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isShadow() &&
                    card.controller === context.player &&
                    card.isFaction('targaryen')
            },
            message: '{player} uses {source} to return {target} to shadows',
            handler: (context) => {
                context.player.moveCard(context.target, 'shadows');
            }
        });
    }
}

SeptaLemore.code = '20032';

module.exports = SeptaLemore;
