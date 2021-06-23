const DrawCard = require('../../drawcard.js');

class SeaSong extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.name === 'The Reader',
            effect: ability.effects.addKeyword('insight')
        });

        this.reaction({
            when: {
                'onCardDiscarded:aggregate': event => (
                    event.events.some(discardEvent => (
                        discardEvent.source === 'reserve')) && 
                    this.controller.canDraw()
                )
            },
            limit: ability.limit.perRound(2),
            choices: {
                'Draw 1 card': () => {
                    if(this.controller.canDraw()) {
                        this.controller.drawCardsToHand(1);
                        this.game.addMessage('{0} uses {1} to draw 1 card', this.controller, this);
                    }
                },
                'Gain 1 power': () => {
                    if(this.controller.canGainFactionPower()) {
                        this.game.addPower(this.controller, 1);
                        this.game.addMessage('{0} uses {1} to gain 1 power for their faction', this.controller, this);
                    }
                }
            }
        });
    }
}

SeaSong.code = '20007';

module.exports = SeaSong;
