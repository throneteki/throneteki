import sample from 'lodash.sample';
import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

const revealAtRandom = (ability) =>
    GameActions.simultaneously([
        GameActions.lastingEffect((context) => ({
            duration: 'untilEndOfPhase',
            targetController: 'any',
            match: (player) => player === context.player,
            effect: ability.effects.mustRevealPlot(sample(context.player.getPlots()))
        })),
        GameActions.lastingEffect((context) => ({
            duration: 'untilEndOfRound',
            condition: () => true,
            match: (card) => card === context.player.activePlot,
            effect: ability.effects.modifyGold(2)
        }))
    ]);

class BeneathTheBridgeOfDream extends DrawCard {
    // Beneath the Bridge of Dream (11011)
    // Shadow (0).
    // Interrupt: When you choose a plot card to reveal in the plot phase, instead shuffle your used
    // pile into your plot deck and choose a plot card to reveal at random. Until the end of the
    // round, increase the gold value on your revealed plot card by 2.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onChoosePlot: (event, context) =>
                    event.players.includes(context.player) && context.game.currentPhase === 'plot'
            },
            message:
                '{player} plays {source} to shuffle their used pile into their plot deck, randomly choose a plot to reveal and give +2 gold to their revealed plot',
            gameAction: GameActions.ifCondition({
                condition: (context) => context.player.plotDiscard.length > 0,
                thenAction: GameActions.simultaneously((context) =>
                    context.player.plotDiscard.map((plot) =>
                        GameActions.placeCard({ card: plot, location: 'plot deck' })
                    )
                ).then({ gameAction: revealAtRandom(ability) }),
                elseAction: revealAtRandom(ability)
            })
        });
    }
}

BeneathTheBridgeOfDream.code = '11011';

export default BeneathTheBridgeOfDream;
