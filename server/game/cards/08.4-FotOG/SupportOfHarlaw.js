import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SupportOfHarlaw extends DrawCard {
    // Support of Harlaw (08072)
    // Challenges Action: Kneel a Warship location to have attached character gain (choose one):
    // pillage, renown, or stealth until the end of the phase.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give keyword to parent',
            phase: 'challenge',
            cost: ability.costs.kneel(
                (card) => card.hasTrait('Warship') && card.getType() === 'location'
            ),
            gameAction: GameActions.choose({
                title: 'Select a keyword',
                message: {
                    format: '{player} uses {source} and kneels {costs.kneel} to have {parent} gain {choice} until the end of the phase',
                    args: { parent: (context) => context.source.parent }
                },
                choices: Object.fromEntries(
                    ['Pillage', 'Renown', 'Stealth'].map((keyword) => [
                        keyword,
                        GameActions.lastingEffect((context) => ({
                            duration: 'untilEndOfPhase',
                            match: context.source.parent,
                            effect: ability.effects.addKeyword(keyword.toLowerCase())
                        }))
                    ])
                )
            })
        });
    }
}

SupportOfHarlaw.code = '08072';

export default SupportOfHarlaw;
