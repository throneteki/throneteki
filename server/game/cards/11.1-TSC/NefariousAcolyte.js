import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class NefariousAcolyte extends DrawCard {
    // Nefarious Acolyte (11018)
    // Shadow (2).
    // Action: Kneel Nefarious Acolyte and pay 1 gold to choose a plot card. Until the end of the
    // phase, treat it as if its printed text box were blank (except for Traits).
    setupCardAbilities(ability) {
        this.action({
            title: 'Blank a plot',
            cost: [ability.costs.kneelSelf(), ability.costs.payGold(1)],
            target: {
                activePromptTitle: 'Select a plot',
                cardCondition: (card) => card.location === 'active plot',
                cardType: 'plot'
            },
            message:
                '{player} kneels {source} and pays 1 gold to blank {target} until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.blankExcludingTraits
            }))
        });
    }
}

NefariousAcolyte.code = '11018';

export default NefariousAcolyte;
