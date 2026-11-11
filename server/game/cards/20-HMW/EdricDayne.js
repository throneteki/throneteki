import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class EdricDayne extends DrawCard {
    // Edric Dayne (20017)
    // Reaction: After a non-loyal card enters your discard pile, place it in shadows (without that
    // card gaining the shadow keyword.). (Limit once per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlaced: (event, context) =>
                    event.card.owner === context.source.controller &&
                    !event.card.isLoyal() &&
                    event.card.location === 'discard pile'
            },
            limit: ability.limit.perRound(1),
            message: {
                format: '{player} uses {source} to place {card} in shadows from their discard pile',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.putIntoShadows((context) => ({
                card: context.event.card,
                allowSave: false
            }))
        });
    }
}

EdricDayne.code = '20017';

export default EdricDayne;
