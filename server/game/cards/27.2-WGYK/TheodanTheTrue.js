import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheodanTheTrue extends DrawCard {
    // Theodan the True (27037)
    // No attachments except The Seven.
    // Reaction: After you win a challenge in which Theodan the True is participating, choose a The
    // Seven character. Until the end of the phase, that character gains insight or renown. (Limit
    // twice per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    context.source.isParticipating() &&
                    event.challenge.isMatch({ winner: context.player })
            },
            target: {
                cardCondition: {
                    location: 'play area',
                    type: 'character',
                    trait: 'The Seven'
                }
            },
            limit: ability.limit.perPhase(2),
            gameAction: GameActions.choose({
                title: (context) => `Choose keyword for ${context.target.name}`,
                message:
                    '{player} uses {source} to have {target} gain {choice} until the end of the phase',
                choices: Object.fromEntries(
                    ['Renown', 'Insight'].map((keyword) => [
                        keyword,
                        GameActions.lastingEffect((context) => ({
                            duration: 'untilEndOfPhase',
                            match: context.target,
                            effect: ability.effects.addKeyword(keyword.toLowerCase())
                        }))
                    ])
                )
            })
        });
    }
}

TheodanTheTrue.code = '27037';

export default TheodanTheTrue;
