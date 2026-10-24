import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TychoNestoris extends DrawCard {
    // Tycho Nestoris (11037)
    // You cannot win the game.
    // Action: Pay 6 gold to treat Tycho Nestoris’s printed text box as if it were blank (except for
    // Traits) until the end of the phase.
    // +3 Income.
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 3
        });

        this.persistentEffect({
            effect: ability.effects.cannotWinGame()
        });

        this.action({
            title: 'Blank Tycho Nestoris',
            cost: ability.costs.payGold(6),
            message:
                '{player} pays 6 gold to treat the text box of {source} as blank until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.source,
                effect: ability.effects.blankExcludingTraits
            }))
        });
    }
}

TychoNestoris.code = '11037';

export default TychoNestoris;
