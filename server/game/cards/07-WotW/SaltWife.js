import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class SaltWife extends DrawCard {
    // Salt Wife (07027)
    // Challenges Action: Sacrifice Salt Wife to choose a character. Until the end of the phase,
    // that character cannot be declared as a defender.
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice Salt Wife',
            phase: 'challenge',
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            message:
                '{player} sacrifices {source} to make {target} unable to be declared as a defender',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.cannotBeDeclaredAsDefender()
            }))
        });
    }
}

SaltWife.code = '07027';

export default SaltWife;
