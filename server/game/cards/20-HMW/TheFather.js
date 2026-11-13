import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class TheFather extends PlotCard {
    // The Father (20054)
    // Forced Interrupt: When the dominance phase ends, choose a unique non-Army character
    // controlled by each player. Then, return each of those characters to its owner's hand.
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onPhaseEnded: (event) => event.phase === 'dominance'
            },
            target: {
                mode: 'eachPlayer',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isUnique() &&
                    !card.hasTrait('Army'),
                gameAction: 'returnToHand'
            },
            message: "{player} uses {source} to return {target} to their owners' hands",
            gameAction: GameActions.simultaneously((context) =>
                context.target.map((card) => GameActions.returnCardToHand({ card }))
            )
        });
    }
}

TheFather.code = '20054';

export default TheFather;
