import DrawCard from '../../drawcard.js';

class SeaSong extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'The Reader',
            effect: ability.effects.addKeyword('insight')
        });

        this.reaction({
            when: {
                'onCardDiscarded:aggregate': (event) =>
                    event.events.some((discardEvent) => discardEvent.source === 'reserve') &&
                    (this.controller.canDraw() || this.controller.canGainFactionPower())
            },
            limit: ability.limit.perRound(2),
            choices: {
                'Draw 1 card': (context) => {
                    if (context.player.canDraw()) {
                        context.player.drawCardsToHand(1);
                        this.game.addMessage('{0} uses {1} to draw 1 card', context.player, this);
                    }
                },
                'Gain 1 power': (context) => {
                    if (context.player.canGainFactionPower()) {
                        this.game.addPower(context.player, 1);
                        this.game.addMessage(
                            '{0} uses {1} to gain 1 power for their faction',
                            context.player,
                            this
                        );
                    }
                }
            }
        });
    }
}

SeaSong.code = '20007';

export default SeaSong;
