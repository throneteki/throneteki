import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class QuietAsAShadow extends DrawCard {
    // Quiet as a Shadow (04099)
    // Action: Choose a unique character with printed cost 3 or lower. Until the end of the phase,
    // that character gains stealth.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character stealth',
            target: {
                cardCondition: (card) =>
                    card.isUnique() &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 3 &&
                    card.location === 'play area'
            },
            message: '{player} plays {source} to give {target} stealth until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.addKeyword('stealth')
            }))
        });
    }
}

QuietAsAShadow.code = '04099';

export default QuietAsAShadow;
