const BaseAbility = require('../baseability');

class MarshalDuplicateAction extends BaseAbility {
    constructor() {
        super({
            abilitySourceType: 'game'
        });
        this.title = 'Marshal as duplicate';
    }

    isAction() {
        return true;
    }

    meetsRequirements(context) {
        var { game, player, source } = context;

        return (
            game.currentPhase === 'marshal' &&
            source.getType() !== 'event' &&
            player.allowMarshal &&
            player.isCardInPlayableLocation(source, 'marshal') &&
            player.canDuplicate(source)
        );
    }

    executeHandler(context) {
        let params = {
            card: context.source,
            originalController: context.source.controller,
            originalLocation: context.source.location,
            player: context.player,
            type: 'dupe'
        };
        context.game.raiseEvent('onCardMarshalled', params, () => {
            context.game.addMessage(this.getMessageFormat(params), context.player, context.source, params.originalController, params.originalLocation, context.costs.gold);
            context.player.putIntoPlay(context.source, 'marshal');
        });
    }

    getMessageFormat(params) {
        const messages = {
            'hand': '{0} duplicates {1} for free',
            'other': '{0} duplicates {1} from their {3} for free'
        };
        let hand = params.originalLocation === 'hand' ? 'hand' : 'other';
        return messages[hand];
    }
}

module.exports = MarshalDuplicateAction;
