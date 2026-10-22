import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

function gainKeyword(source, keyword) {
    source.untilEndOfChallenge((ability) => ({
        match: source,
        effect: ability.effects.addKeyword(keyword)
    }));
    return true;
}

class NestorRoyce extends DrawCard {
    // Nestor Royce (23023)
    // Reaction: After you win a challenge in which Nestor Royce is participating, kneel a neutral
    // location with printed cost 1 or higher to have him gain intimidate or renown until the end of
    // the challenge.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    context.source.isAttacking() &&
                    event.challenge.isMatch({ winner: context.source.controller })
            },
            cost: ability.costs.kneel({
                type: 'location',
                faction: 'neutral',
                printedCostOrHigher: 1
            }),
            message:
                '{player} uses {source} and kneels {costs.kneel} to give {source} renown or intimidate',
            gameAction: GameActions.choose({
                title: (context) => `Choose keyword for ${context.source.name}`,
                message: {
                    format: '{player} chooses to have {source} gain {keyword} until the end of the challenge',
                    args: { keyword: (context) => context.selectedChoice.text.toLowerCase() }
                },
                choices: {
                    Renown: GameActions.genericHandler((context) =>
                        gainKeyword(context.source, context.selectedChoice.text.toLowerCase())
                    ),
                    Intimidate: GameActions.genericHandler((context) =>
                        gainKeyword(context.source, context.selectedChoice.text.toLowerCase())
                    )
                }
            })
        });
    }
}

NestorRoyce.code = '23023';

export default NestorRoyce;
