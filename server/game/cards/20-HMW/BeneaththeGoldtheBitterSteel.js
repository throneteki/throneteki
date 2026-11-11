import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/Tokens.js';
import GameActions from '../../GameActions/index.js';

class BeneaththeGoldtheBitterSteel extends DrawCard {
    // Beneath the Gold, the Bitter Steel (20035)
    // Challenges Action: Choose a Mercenary character with 1 or more gold. Until the end of the
    // phase, it gains renown and no attachments except Item. If it has 3 or more gold, it gains
    // insight and intimidate until the end of the phase.
    setupCardAbilities(ability) {
        this.action({
            target: {
                activePromptTitle: 'Select a Mercenary with gold',
                cardCondition: (card) => card.hasTrait('Mercenary') && card.hasToken(Tokens.gold)
            },
            phase: 'challenge',
            message: {
                format: '{player} plays {source} to have {target} gain No attachments except Item and renown{extra} until the end of the phase',
                args: {
                    extra: (context) =>
                        context.target.tokens[Tokens.gold] >= 3 ? ' and insight and intimidate' : ''
                }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: [
                    ability.effects.addKeyword('Renown'),
                    ability.effects.addKeyword('No attachments except <i>Item</i>'),
                    ...(context.target.tokens[Tokens.gold] >= 3
                        ? [
                              ability.effects.addKeyword('Intimidate'),
                              ability.effects.addKeyword('Insight')
                          ]
                        : [])
                ]
            }))
        });
    }
}

BeneaththeGoldtheBitterSteel.code = '20035';

export default BeneaththeGoldtheBitterSteel;
