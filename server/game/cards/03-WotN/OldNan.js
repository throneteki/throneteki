import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OldNan extends DrawCard {
    // Old Nan (03010)
    // Interrupt: When a plot card is revealed, kneel Old Nan to have that plot card gain the Summer
    // or Winter trait until the end of the round.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onPlotsRevealed: () => true
            },
            cost: ability.costs.kneelSelf(),
            target: {
                type: 'select',
                activePromptTitle: 'Select plot to modify',
                cardType: ['plot'],
                cardCondition: (card, context) => context.event.plots.includes(card)
            },
            gameAction: GameActions.choose({
                title: 'Select trait to add',
                message: '{player} uses {source} to add the {choice} trait to {target}',
                choices: Object.fromEntries(
                    ['Winter', 'Summer'].map((trait) => [
                        trait,
                        GameActions.lastingEffect((context) => ({
                            duration: 'untilEndOfRound',
                            match: context.target,
                            targetController: 'any',
                            effect: ability.effects.addTrait(trait)
                        }))
                    ])
                )
            })
        });
    }
}

OldNan.code = '03010';

export default OldNan;
