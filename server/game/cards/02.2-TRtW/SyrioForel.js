import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class SyrioForel extends DrawCard {
    // Syrio Forel (02037)
    // Stealth.
    // Challenges Action: Choose a character. Until the end of the phase, that character gains a
    // [military] icon and stealth. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Give a character military icon and stealth',
            limit: ability.limit.perPhase(1),
            phase: 'challenge',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            message:
                '{player} uses {source} to give {target} a military icon and stealth until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: [ability.effects.addIcon('military'), ability.effects.addKeyword('Stealth')]
            }))
        });
    }
}

SyrioForel.code = '02037';

export default SyrioForel;
