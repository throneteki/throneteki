import DrawCard from '../../drawcard.js';

class SpearsOfTheMerlingKing extends DrawCard {
    // Spears of the Merling King (06048)
    // Interrupt: When a character you control is killed, sacrifice Spears of the Merling King to
    // return that character to your hand instead of placing it in your dead pile.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharacterKilled: (event) => event.card.controller === this.controller
            },
            cost: ability.costs.sacrificeSelf(),
            handler: (context) => {
                this.game.addMessage(
                    '{0} sacrifices {1} to return {2} to their hand',
                    context.player,
                    this,
                    context.event.card
                );
                context.replaceHandler(() => {
                    context.event.cardStateWhenKilled = context.event.card.createSnapshot();
                    this.controller.moveCard(context.event.card, 'hand');
                });
            }
        });
    }
}

SpearsOfTheMerlingKing.code = '06048';

export default SpearsOfTheMerlingKing;
