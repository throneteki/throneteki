import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Starfall extends DrawCard {
    // Starfall (10018)
    // Challenges Action: Kneel Starfall to choose a character. Until the end of the phase, that
    // character loses a challenge icon of your choice.
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove icon',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            gameAction: GameActions.chooseIcon({
                message: '{player} kneels {source} to remove {icon} icon from {target}',
                gameAction: (icon) =>
                    GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfPhase',
                        match: context.target,
                        effect: ability.effects.removeIcon(icon)
                    }))
            })
        });
    }
}

Starfall.code = '10018';

export default Starfall;
