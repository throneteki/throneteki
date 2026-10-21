import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NightfortBuilder extends DrawCard {
    // Nightfort Builder (11105)
    // Reaction: After Nightfort Builder is knelt, reveal the top card of your deck. If it is a
    // [thenightswatch] location or attachment, draw it.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardKneeled: (event) => event.card === this
            },
            message: '{player} uses {source} to reveal the top card of their deck',
            gameAction: GameActions.revealTopCards((context) => ({
                player: context.player
            })).then({
                condition: (context) =>
                    context.event.cards[0].isMatch({
                        faction: 'thenightswatch',
                        type: ['attachment', 'location']
                    }),
                message: '{player} {gameAction}',
                gameAction: GameActions.drawSpecific((context) => ({
                    player: context.player,
                    cards: context.parentContext.revealed
                }))
            })
        });
    }
}

NightfortBuilder.code = '11105';

export default NightfortBuilder;
