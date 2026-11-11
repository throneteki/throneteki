import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Smiler extends DrawCard {
    // Smiler (26084)
    // Ambush (2).
    // Reaction: After you win an unopposed challenge in which attached character is attacking,
    // kneel Smiler to have attached character gain intimidate or renown until the end of the
    // challenge.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    context.source.parent.isAttacking() &&
                    event.challenge.isMatch({ winner: context.player, unopposed: true })
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {costs.kneel} to give {parent} renown or intimidate until the end of the challenge',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.choose({
                title: (context) => `Choose keyword for ${context.source.parent.name}`,
                message: {
                    format: '{player} chooses to have {parent} gain {choice} until the end of the challenge',
                    args: { parent: (context) => context.source.parent }
                },
                choices: Object.fromEntries(
                    ['Renown', 'Intimidate'].map((keyword) => [
                        keyword,
                        GameActions.lastingEffect((context) => ({
                            duration: 'untilEndOfChallenge',
                            match: context.source.parent,
                            effect: ability.effects.addKeyword(keyword.toLowerCase())
                        }))
                    ])
                )
            })
        });
    }
}

Smiler.code = '26084';

export default Smiler;
