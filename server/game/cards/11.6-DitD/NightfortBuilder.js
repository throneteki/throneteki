import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NightfortBuilder extends DrawCard {
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
                    cards: context.event.revealed
                }))
            })
        });
    }
}

NightfortBuilder.code = '11105';

export default NightfortBuilder;
