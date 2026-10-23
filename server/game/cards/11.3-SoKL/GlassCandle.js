import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GlassCandle extends DrawCard {
    // Glass Candle (11059)
    // Character you control only.
    // If attached character has the Maester trait, it gains insight.
    // Challenges Action: Kneel Glass Candle to look at the top card of any player's deck. You may
    // discard that card.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'current' });
        this.whileAttached({
            condition: (context) => context.source.parent.hasTrait('Maester'),
            effect: ability.effects.addKeyword('insight')
        });
        this.action({
            title: 'Look at top card',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            choosePlayer: (player) => player.drawDeck.length > 0,
            message: "{player} kneels {source} to look at the top card of {chosenPlayer}'s deck",
            gameAction: GameActions.lookAtDeck((context) => ({
                player: context.player,
                lookingAt: context.chosenPlayer,
                amount: 1
            })).then({
                gameAction: GameActions.may({
                    title: (context) =>
                        `Discard ${context.parentContext.chosenPlayer.drawDeck[0].name}?`,
                    message: {
                        format: "{player} discards the top card of {chosenPlayer}'s deck",
                        args: { chosenPlayer: (context) => context.parentContext.chosenPlayer }
                    },
                    gameAction: GameActions.discardTopCards((context) => ({
                        player: context.parentContext.chosenPlayer,
                        amount: 1
                    }))
                })
            })
        });
    }
}

GlassCandle.code = '11059';

export default GlassCandle;
