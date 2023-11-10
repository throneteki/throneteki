const DrawCard = require('../../drawcard.js');

class SerAndrewEstermont extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: event => event.allowSave && event.card.canBeSaved() && event.card.controller === this.controller && event.card.isUnique() && event.card.isFaction('baratheon')
            },
            cost: ability.costs.kill(card => card.hasTrait('R\'hllor')),
            limit: ability.limit.perRound(1),
            message: {
                format: '{player} uses {source} and kills {costs.kill} to save {character}',
                args: { character: context => context.event.card }
            },
            handler: context => {
                context.event.saveCard();
                this.game.addMessage('{0} kills {1} to save {2}', context.player, this, context.event.card);
            }
        });
    }
}

SerAndrewEstermont.code = '25502';
SerAndrewEstermont.version = '1.0';

module.exports = SerAndrewEstermont;
