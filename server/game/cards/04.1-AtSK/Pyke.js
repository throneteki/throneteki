import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Pyke extends DrawCard {
    // Pyke (04013)
    // Action: Kneel Pyke to choose a character. Until the end of the phase, that character gains
    // stealth.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character stealth',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' && card.location === 'play area'
            },
            message:
                '{player} kneels {source} to have {target} gain stealth until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.addKeyword('Stealth')
            }))
        });
    }
}

Pyke.code = '04013';

export default Pyke;
