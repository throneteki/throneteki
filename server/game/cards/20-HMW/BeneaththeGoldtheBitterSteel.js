const DrawCard = require('../../drawcard.js');
const Tokens = require('../../Constants/Tokens.js');

class BeneaththeGoldtheBitterSteel extends DrawCard {
    setupCardAbilities() {
        this.action({
            target: {
                activePromptTitle: 'Select a Mercenary with gold',
                cardCondition: (card) => card.hasTrait('Mercenary') && card.hasToken(Tokens.gold)
            },
            phase: 'challenge',
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: [
                        ability.effects.addKeyword('Renown'),
                        ability.effects.addKeyword('No attachments except <i>Item</i>')
                    ]
                }));
                let goldMessage = '';

                if (context.target.tokens[Tokens.gold] >= 3) {
                    this.untilEndOfPhase((ability) => ({
                        match: context.target,
                        effect: [
                            ability.effects.addKeyword('Intimidate'),
                            ability.effects.addKeyword('Insight')
                        ]
                    }));
                    goldMessage = ' and insight and intimidate';
                }
                this.game.addMessage(
                    '{0} plays {1} to have {2} gain No attachments except Item and renown{3} until the end of the phase',
                    context.player,
                    this,
                    context.target,
                    goldMessage
                );
            }
        });
    }
}

BeneaththeGoldtheBitterSteel.code = '20035';

module.exports = BeneaththeGoldtheBitterSteel;
