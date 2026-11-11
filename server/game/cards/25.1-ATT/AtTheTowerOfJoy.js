import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class AtTheTowerOfJoy extends PlotCard {
    // At the Tower of Joy (25019)
    // When Revealed: Choose a character. Until you reveal a new plot card, that character cannot be
    // killed.
    setupCardAbilities(ability) {
        this.whenRevealed({
            target: {
                cardCondition: { type: 'character', location: 'play area' }
            },
            message:
                '{player} uses {source} to make {target} unkillable until the end of the round',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'custom',
                until: {
                    onCardEntersPlay: (event) =>
                        event.card.getType() === 'plot' && event.card.controller === context.player
                },
                match: context.target,
                effect: ability.effects.cannotBeKilled()
            }))
        });
    }
}

AtTheTowerOfJoy.code = '25019';

export default AtTheTowerOfJoy;
