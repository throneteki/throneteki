import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class TheFather extends PlotCard {
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onPhaseEnded: (event) =>
                    event.phase === 'dominance' &&
                    this.game.anyCardsInPlay(
                        (card) => card.getType() === 'character' && card.isUnique()
                    )
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isUnique() &&
                    !card.hasTrait('Army'),
                mode: 'eachPlayer',
                gameAction: 'returnToHand'
            },
            message: "{player} uses {source} to return {target} to its owner's hands",
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        context.target.map((card) => GameActions.returnCardToHand({ card }))
                    ),
                    context
                );
            }
        });
    }
}

TheFather.code = '20054';

export default TheFather;
