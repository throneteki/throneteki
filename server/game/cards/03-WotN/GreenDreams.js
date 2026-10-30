import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GreenDreams extends DrawCard {
    // Green Dreams (03043)
    // Terminal.
    // Reaction: After attached character is knelt, look at the top card of your deck. You may put
    // that card on the bottom of your deck.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardKneeled: (event, context) =>
                    !!context.source.parent &&
                    event.card === context.source.parent &&
                    context.player.drawDeck.length > 0
            },
            message: '{player} uses {source} to look at the top card of their deck',
            gameAction: GameActions.may({
                title: (context) =>
                    `Put ${context.player.drawDeck[0].name} on bottom of your deck?`,
                message: '{player} puts the top card of their deck on the bottom',
                gameAction: GameActions.placeCard((context) => ({
                    card: context.player.drawDeck[0],
                    location: 'draw deck',
                    bottom: true
                }))
            })
        });
    }
}

GreenDreams.code = '03043';

export default GreenDreams;
