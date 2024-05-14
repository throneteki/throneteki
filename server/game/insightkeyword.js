const ChallengeKeywordAbility = require('./ChallengeKeywordAbility.js');
const GameActions = require('./GameActions');
const TextHelper = require('./TextHelper');

class InsightKeyword extends ChallengeKeywordAbility {
    constructor() {
        super('Insight', {
            message: {
                format: '{player} draws {amount} from Insight on {source}',
                args: {
                    amount: (context) => TextHelper.count(this.getTriggerAmount(context), 'card')
                }
            },
            gameAction: GameActions.drawCards((context) => ({
                player: context.challenge.winner,
                amount: this.getTriggerAmount(context),
                reason: 'insight',
                source: context.source
            }))
        });
    }
}

module.exports = InsightKeyword;
