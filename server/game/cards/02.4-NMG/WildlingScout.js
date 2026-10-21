import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class WildlingScout extends DrawCard {
    // Wildling Scout (02078)
    // Action: Sacrifice Wildling Scout to choose a character. Until the end of the phase, that
    // character gains stealth.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give another character stealth',
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' && card.location === 'play area'
            },
            message: '{player} sacrifices {source} to make {target} gain stealth',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.addKeyword('Stealth')
            }))
        });
    }
}

WildlingScout.code = '02078';

export default WildlingScout;
