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
            originalParent: context.source.parent,
            wasFacedownAttachment: context.source.facedown && context.source.getType() === 'attachment',
            player: context.player,
            type: 'dupe'
        };
        context.game.raiseEvent('onCardMarshalled', params, () => {
            context.player.putIntoPlay(context.source, 'marshal');
            context.game.addMessage(this.getMessageFormat(params), context.player, context.source, params.originalLocation, params.originalParent);
        });
    }

    getMessageFormat(params) {
        const messages = {
            'hand': '{0} duplicates {1} for free',
            'underneath': '{0} duplicates {1} from underneath {3} for free',
            'other': '{0} duplicates {1} from their {2} for free'
        };
        let marshalLocation = params.originalLocation === 'hand' ? 'hand' : params.originalLocation === 'underneath' || params.wasFacedownAttachment ? 'underneath' : 'other';
        return messages[marshalLocation] || messages['hand'];
    }
}

module.exports = MarshalDuplicateAction;
