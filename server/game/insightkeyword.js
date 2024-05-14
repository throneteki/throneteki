import ChallengeKeywordAbility from './ChallengeKeywordAbility.js';
import GameActions from './GameActions/index.js';
import TextHelper from './TextHelper.js';

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

export default InsightKeyword;
