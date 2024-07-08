import PutIntoShadows from '../GameActions/PutIntoShadows.js';
import BaseAbility from '../baseability.js';
import Costs from '../costs.js';
import { OpenInformationLocations } from '../CardVisibility.js';

class MarshalIntoShadowsAction extends BaseAbility {
    constructor() {
        super({
            abilitySourceType: 'game',
            cost: [Costs.payReduceableGoldCost('marshalIntoShadows')]
        });
        this.title = 'Marshal into shadows';
    }

    isAction() {
        return true;
    }

    meetsRequirements(context) {
        let { game, player, source } = context;

        return (
            game.currentPhase === 'marshal' &&
            source.isShadow() &&
            player.allowMarshal &&
            player.isCardInPlayableLocation(source, 'marshalIntoShadows')
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
            type: 'shadows'
        };
        context.game.raiseEvent('onCardMarshalled', params, (event) => {
            const card = this.shouldHideSourceInMessage(context) ? 'a card' : context.source;
            context.game.addMessage(
                this.getMessageFormat(params),
                context.player,
                card,
                params.originalController,
                params.originalLocation,
                params.originalParent,
                context.costs.gold
            );
            event.thenAttachEvent(
                PutIntoShadows.createEvent({ card: context.source, reason: 'marshal' })
            );
        });
    }

    getMessageFormat(params) {
        const messages = {
            'hand.current': '{0} marshals {1} into shadows costing {5} gold',
            'other.current': '{0} marshals {1} into shadows from their {3} costing {5} gold',
            'other.opponent': "{0} marshals {1} into shadows from {2}'s {3} costing {5} gold",
            'underneath.current':
                '{0} marshals {1} into shadows from underneath {4} costing {5} gold',
            'underneath.opponent':
                "{0} marshals {1} into shadows from underneath {2}'s {4} costing {5} gold"
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

    shouldHideSourceInMessage(context) {
        return !(context.source && OpenInformationLocations.includes(context.source.location));
    }
}

export default MarshalIntoShadowsAction;
