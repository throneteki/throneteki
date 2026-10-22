import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Stonesnake extends DrawCard {
    // Stonesnake (03033)
    // Stealth.
    // Reaction: After Stonesnake bypasses a character using stealth, choose one of that character's
    // keywords. Stonesnake gains that keyword until the end of the phase.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onBypassedByStealth: (event, context) =>
                    event.source === context.source && event.target.getKeywords().length > 0
            },
            gameAction: GameActions.choose({
                title: 'Select a keyword',
                message:
                    '{player} uses {source} to have {source} gain {choice} until the end of the phase',
                choices: (context) =>
                    Object.fromEntries(
                        context.event.target.getKeywords().map((keyword) => [
                            keyword,
                            GameActions.lastingEffect((context) => ({
                                duration: 'untilEndOfPhase',
                                match: context.source,
                                effect: ability.effects.addKeyword(keyword.toLowerCase())
                            }))
                        ])
                    )
            })
        });
    }
}

Stonesnake.code = '03033';

export default Stonesnake;
