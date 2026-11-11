import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Gilly extends DrawCard {
    // Gilly (06025)
    // Bestow (3).
    // Action: Discard 1 gold from Gilly to choose a Steward character you control. Until the end of
    // the phase, that character gains stealth.
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard 1 gold from ' + this.name,
            cost: ability.costs.discardGold(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.source.controller &&
                    card.hasTrait('Steward') &&
                    card.getType() === 'character'
            },
            message:
                '{player} discards 1 gold from {source} to have {target} gain stealth until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.addKeyword('stealth')
            }))
        });
    }
}

Gilly.code = '06025';

export default Gilly;
