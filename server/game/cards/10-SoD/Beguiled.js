import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Beguiled extends DrawCard {
    // Beguiled (10021)
    // Terminal.
    // Challenges Action: Kneel Beguiled to have attached character lose a challenge icon of your
    // choice until the end of the phase.
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove icon',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            gameAction: GameActions.chooseIcon({
                message: {
                    format: '{player} kneels {source} to remove {icon} icon from {parent}',
                    args: { parent: (context) => context.source.parent }
                },
                gameAction: (icon) =>
                    GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfPhase',
                        match: context.source.parent,
                        effect: ability.effects.removeIcon(icon)
                    }))
            })
        });
    }
}

Beguiled.code = '10021';

export default Beguiled;
