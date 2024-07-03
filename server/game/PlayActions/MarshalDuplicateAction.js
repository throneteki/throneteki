import BaseAbility from '../baseability.js';

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
            wasFacedownAttachment:
                context.source.facedown && context.source.getType() === 'attachment',
            player: context.player,
            type: 'dupe'
        };
        context.game.raiseEvent('onCardMarshalled', params, () => {
            context.game.addMessage(
                this.getMessageFormat(params),
                context.player,
                context.source,
                params.originalController,
                params.originalLocation,
                params.originalParent
            );
            context.player.putIntoPlay(context.source, 'marshal');
        });
    }

    getMessageFormat(params) {
        const messages = {
            'hand.current': '{0} duplicates {1} for free',
            'other.current': '{0} duplicates {1} from their {3} for free',
            'other.opponent': "{0} duplicates {1} from {2}'s {3} for free",
            'underneath.current': '{0} duplicates {1} from underneath {4} for free',
            'underneath.opponent': "{0} duplicates {1} from underneath {2}'s {4} for free"
        };
        let marshalLocation =
            params.originalLocation === 'hand'
                ? 'hand'
                : params.originalLocation === 'underneath' || params.wasFacedownAttachment
                  ? 'underneath'
                  : 'other';
        let current = params.originalController === params.player ? 'current' : 'opponent';
        return messages[`${marshalLocation}.${current}`] || messages['hand.current'];
    }
}

export default MarshalDuplicateAction;
