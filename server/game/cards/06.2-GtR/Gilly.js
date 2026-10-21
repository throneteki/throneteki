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
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.controller &&
                    card.hasTrait('Steward') &&
                    card.getType() === 'character'
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.addKeyword('stealth')
                }));

                this.game.addMessage(
                    '{0} discards 1 gold from {1} to have {2} gain stealth until the end of the phase',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

Gilly.code = '06025';

export default Gilly;
