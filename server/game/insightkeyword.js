const BaseAbility = require('./baseability');
const GameActions = require('./GameActions');
const TextHelper = require('./TextHelper');

class InsightKeyword extends BaseAbility {
    constructor() {
        super({
            message: {
                format: '{player} draws {amount} from Insight on {source}',
                args: { amount: context => TextHelper.count(this.getAmount(context.source), 'card') }
            },
            gameAction: GameActions.drawCards(context => ({
                player: context.challenge.winner,
                amount: this.getAmount(context.source),
                reason: 'insight',
                source: context.source
            }))});
        this.title = 'Insight';
    }

    getAmount(source) {
        return 1 + source.getKeywordTriggerModifier(this.title);
    }
}

module.exports = InsightKeyword;
