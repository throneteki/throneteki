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
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: this,
                    effect: ability.effects.blankExcludingTraits
                }));

                this.game.addMessage(
                    '{0} pays 6 gold to treat the text box of {1} as blank until the end of the phase',
                    context.player,
                    this
                );
            }
        });
    }
}

TychoNestoris.code = '11037';

export default TychoNestoris;
