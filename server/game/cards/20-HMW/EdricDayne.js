import DrawCard from '../../drawcard.js';

class EdricDayne extends DrawCard {
    // Edric Dayne (20017)
    // Reaction: After a non-loyal card enters your discard pile, place it in shadows (without that
    // card gaining the shadow keyword.). (Limit once per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlaced: (event) =>
                    event.card.owner === this.controller &&
                    !event.card.isLoyal() &&
                    event.card.location === 'discard pile'
            },
            limit: ability.limit.perRound(1),
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to place {2} in shadows from their discard pile',
                    context.player,
                    this,
                    context.event.card
                );
                context.player.putIntoShadows(context.event.card, false);
            }
        });
    }
}

EdricDayne.code = '20017';

export default EdricDayne;
