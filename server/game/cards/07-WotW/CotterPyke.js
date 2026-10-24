import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class CotterPyke extends DrawCard {
    // Cotter Pyke (07004)
    // Stealth.
    // Reaction: After Cotter Pyke bypasses a character using stealth, if there is a Winter plot
    // card revealed, choose a [thenightswatch] character and have it gain stealth until the end of
    // the phase.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onBypassedByStealth: (event, context) =>
                    event.source === context.source && context.game.anyPlotHasTrait('Winter')
            },
            target: {
                cardCondition: (card) =>
                    card.isFaction('thenightswatch') &&
                    card.getType() === 'character' &&
                    card.location === 'play area'
            },
            message:
                '{player} uses {source} to have {target} gain stealth until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.addKeyword('Stealth')
            }))
        });
    }
}

CotterPyke.code = '07004';

export default CotterPyke;
