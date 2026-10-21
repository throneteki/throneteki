import PlotCard from '../../plotcard.js';

class WeTakeWesteros extends PlotCard {
    // We Take Westeros! (12046)
    // When Revealed: Choose a location in a discard pile and put it into play under your control.
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) =>
                    card.getType() === 'location' &&
                    card.location === 'discard pile' &&
                    context.player.canPutIntoPlay(card)
            },
            handler: (context) => {
                context.player.putIntoPlay(context.target);
                this.game.addMessage(
                    "{0} uses {1} to put {2} into play from {3}'s discard pile ",
                    context.player,
                    this,
                    context.target,
                    context.target.owner
                );
            }
        });
    }
}

WeTakeWesteros.code = '12046';

export default WeTakeWesteros;
