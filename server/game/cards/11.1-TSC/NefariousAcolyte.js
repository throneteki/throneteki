import DrawCard from '../../drawcard.js';

class NefariousAcolyte extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Blank a plot',
            cost: [ability.costs.kneelSelf(), ability.costs.payGold(1)],
            target: {
                activePromptTitle: 'Select a plot',
                cardCondition: (card) => card.location === 'active plot',
                cardType: 'plot'
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.blankExcludingTraits
                }));
                this.game.addMessage(
                    '{0} kneels {1} and pays 1 gold to blank {2} until the end of the phase',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

NefariousAcolyte.code = '11018';

export default NefariousAcolyte;
