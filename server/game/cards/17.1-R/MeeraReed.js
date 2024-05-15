import DrawCard from '../../drawcard.js';

class MeeraReed extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPlotsRevealed: (event) => event.plots.some((plot) => plot.hasTrait('Winter'))
            },
            handler: (context) => {
                this.game.addMessage('{0} uses {1} to return {1} to shadows', context.player, this);
                context.player.putIntoShadows(this, false);
            }
        });

        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' && card.location === 'play area'
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.blankExcludingTraits
                }));

                this.game.addMessage(
                    '{0} uses {1} to treat the text box of {2} as blank until the end of the phase',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

MeeraReed.code = '17123';

export default MeeraReed;
