import ChallengeKeywordAbility from './ChallengeKeywordAbility.js';
import GameActions from './GameActions/index.js';

class RenownKeyword extends ChallengeKeywordAbility {
    constructor() {
        super('Renown', {
            message: {
                format: '{player} gains {amount} power on {source} from Renown',
                args: { amount: (context) => this.getTriggerAmount(context) }
            },
            gameAction: GameActions.gainPower((context) => ({
                card: context.source,
                amount: this.getTriggerAmount(context),
                reason: 'renown',
                source: context.source
            }))
        });
    }
}

export default RenownKeyword;
