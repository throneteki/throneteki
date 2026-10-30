import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheWinterMaid extends DrawCard {
    // "The Winter Maid" (19012)
    // Interrupt: When a plot card is revealed, that plot card gains the Winter trait until the end
    // of the round. If there are no Summer plot cards revealed, return "The Winter Maid" to your
    // hand instead of placing it in your discard pile. (Max 1 per phase.)
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onPlotsRevealed: () => true
            },
            max: ability.limit.perPhase(1),
            gameAction: GameActions.simultaneously([
                GameActions.chooseCards({
                    title: 'Select plot',
                    cardCondition: (card, context) => context.event.plots.includes(card),
                    gameAction: (card) =>
                        GameActions.lastingEffect(() => ({
                            duration: 'untilEndOfRound',
                            match: card,
                            effect: ability.effects.addTrait('Winter')
                        }))
                }),
                GameActions.ifCondition({
                    condition: (context) =>
                        !context.game.anyPlotHasTraitDuringPlotInterrupt('Summer'),
                    thenAction: {
                        message:
                            '{player} returns {source} to their hand instead of their discard pile',
                        gameAction: GameActions.returnCardToHand((context) => ({
                            card: context.source
                        }))
                    }
                })
            ])
        });
    }
}

TheWinterMaid.code = '19012';

export default TheWinterMaid;
