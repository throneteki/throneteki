import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class DefensiveDebris extends DrawCard {
    // Defensive Debris (23010)
    // Bestow (2).
    // Attached character gets +1 STR.
    // Challenges Action: Discard 1 gold from Defensive Debris to choose a card in an opponent's
    // discard pile. Until the end of the phase, cards with the same printed cost as the chosen card
    // cannot be played or put into play. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(1)
        });
        this.action({
            title: 'Discard gold to choose a discarded card',
            cost: ability.costs.discardGold(),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: { location: 'discard pile', controller: 'opponent' }
            },
            phase: 'challenge',
            limit: ability.limit.perPhase(1),
            message: {
                format: '{player} discards 1 gold from {source} and chooses {target} to prevent cards with printed cost {printedCost} from being played or entering play until the end of the phase',
                args: { printedCost: (context) => context.target.getPrintedCost() }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                targetController: 'any',
                effect: [
                    ability.effects.cannotPutIntoPlay(
                        (card) => card.getPrintedCost() === context.target.getPrintedCost()
                    ),
                    ability.effects.cannotPlay(
                        (card) => card.getPrintedCost() === context.target.getPrintedCost()
                    )
                ]
            }))
        });
    }
}

DefensiveDebris.code = '23010';

export default DefensiveDebris;
