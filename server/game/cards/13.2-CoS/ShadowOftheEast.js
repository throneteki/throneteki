import DrawCard from '../../drawcard.js';

class ShadowOfTheEast extends DrawCard {
    // Shadow of the East (13034)
    // Shadow (0).
    // Action: Choose an attachment and discard it from play. If there is a Summer plot card
    // revealed, return Shadow of the East to your hand instead of placing it in your discard pile.
    setupCardAbilities() {
        this.action({
            title: 'Select an attachment',
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'attachment'
            },
            handler: (context) => {
                let attachment = context.target;
                attachment.owner.discardCard(attachment);
                this.game.addMessage(
                    '{0} plays {1} to discard {2}',
                    this.controller,
                    this,
                    context.target
                );
                if (
                    this.game
                        .getPlayers()
                        .some((player) => player.activePlot && player.activePlot.hasTrait('Summer'))
                ) {
                    this.game.addMessage(
                        '{0} uses {1} to return {1} to their hand instead of their discard pile',
                        this.controller,
                        this
                    );
                    this.controller.moveCard(this, 'hand');
                }
            }
        });
    }
}

ShadowOfTheEast.code = '13034';

export default ShadowOfTheEast;
