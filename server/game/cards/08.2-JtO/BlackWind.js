const DrawCard = require('../../drawcard.js');

class BlackWind extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.name === 'Asha Greyjoy',
            effect: ability.effects.addKeyword('renown')
        });

        this.reaction({
            when: {
                onPillage: event => event.source.controller === this.controller && ['attachment', 'location'].includes(event.discardedCard.getType())
            },
            limit: ability.limit.perPhase(2),
            handler: context => {
                context.player.drawCardsToHand(1);
                this.game.addMessage('{0} uses {1} to draw 1 card', context.player, this);
            }
        });
    }
}

BlackWind.code = '08032';

module.exports = BlackWind;
