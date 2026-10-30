import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class HighbornRecruit extends DrawCard {
    // Highborn Recruit (25029)
    // Challenges Action: Kneel Highborn Recruit to choose a character with 1 or fewer challenge
    // icons. Until the end of the phase, that character gains insight or renown.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character keyword',
            phase: 'challenge',
            target: {
                cardCondition: {
                    type: 'character',
                    location: 'play area',
                    condition: (card) => card.getNumberOfIcons() <= 1
                }
            },
            cost: ability.costs.kneelSelf(),
            gameAction: GameActions.choose({
                title: (context) => `Choose keyword for ${context.target.name} to gain`,
                message: {
                    format: '{player} kneels {source} to have {target} gain {keyword} until the end of the phase',
                    args: {
                        keyword: (context) => context.selectedChoice.text.toLowerCase()
                    }
                },
                choices: {
                    Renown: gainKeyword(ability, 'renown'),
                    Insight: gainKeyword(ability, 'insight')
                }
            })
        });
    }
}

function gainKeyword(ability, keyword) {
    return GameActions.lastingEffect((context) => ({
        duration: 'untilEndOfPhase',
        match: context.target,
        effect: ability.effects.addKeyword(keyword)
    }));
}

HighbornRecruit.code = '25029';

export default HighbornRecruit;
