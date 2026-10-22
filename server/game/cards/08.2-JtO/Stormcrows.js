import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Stormcrows extends DrawCard {
    // Stormcrows (08033)
    // Bestow (5).
    // Challenges Action: Discard X gold from Stormcrows to choose X characters. Until the end of
    // the phase, each of those characters gets -1 STR. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character(s) -1 STR',
            phase: 'challenge',
            limit: ability.limit.perPhase(1),
            cost: ability.costs.discardXGold(
                () => 1,
                (context) =>
                    context.game.getNumberOfCardsInPlay((card) => card.getType() === 'character')
            ),
            target: {
                mode: 'exactly',
                numCards: (context) => context.xValue || 1,
                activePromptTitle: 'Select characters',
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            message: {
                format: '{player} discards {xValue} gold from {source} to give {target} -1 STR until the end of the phase',
                args: { xValue: (context) => context.xValue }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                targetController: 'any',
                effect: ability.effects.modifyStrength(-1)
            }))
        });
    }
}

Stormcrows.code = '08033';

export default Stormcrows;
