import DrawCard from '../../drawcard.js';

class CotterPyke extends DrawCard {
    // Cotter Pyke (07004)
    // Stealth.
    // Reaction: After Cotter Pyke bypasses a character using stealth, if there is a Winter plot
    // card revealed, choose a [thenightswatch] character and have it gain stealth until the end of
    // the phase.
    setupCardAbilities() {
        this.reaction({
            when: {
                onBypassedByStealth: (event) =>
                    event.source === this && this.game.anyPlotHasTrait('Winter')
            },
            target: {
                cardCondition: (card) =>
                    card.isFaction('thenightswatch') &&
                    card.getType() === 'character' &&
                    card.location === 'play area'
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.addKeyword('Stealth')
                }));

                this.game.addMessage(
                    '{0} uses {1} to have {2} gain stealth until the end of the phase',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

CotterPyke.code = '07004';

export default CotterPyke;
