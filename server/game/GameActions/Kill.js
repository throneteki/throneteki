const GameAction = require('./GameAction');
const Message = require('../Message');
const LeavePlay = require('./LeavePlay');
const PlaceCard = require('./PlaceCard');
const SimultaneousEvents = require('../SimultaneousEvents');
const {flatten} = require('../../Array');
const GroupedCardEvent = require('../GroupedCardEvent');

class Kill extends GameAction {
    constructor() {
        super('kill');
    }

    message({ victims }) {
        if (!Array.isArray(victims)) victims = [victims];

        return Message.fragment('kills {victims}', { victims });
    }

    allow({ victims, context }) {
        if (!Array.isArray(victims)) victims = [victims];
        return victims.some(victim => this.isAllowed(victim, context));
    }

    canChangeGameState({ victim }) {
        return victim.card.location === 'play area' && victim.card.getType() === 'character';
    }

    isAllowed(victim, context) {
        return this.canChangeGameState({ victim }) && !this.isImmune({ card: victim.card, context });
    }

    /**
     * A "victim" is an object with the following properties:
     * - card: (required) the card to be killed
     * - player: (optional, default card.controller) the player causing the kill
     * - isBurn: (optional, default false) whether the kill effect is terminal
     * - allowSave: (optional, default true) whether the kill effect allow save interrupts
     * - force: (optional, default false) whether the kill effect is forced
     * @param victims - single victim or array of victim object
     * @param context - execution context
     */
    createEvent({ victims, context }) {
        if (!Array.isArray(victims)) victims = [victims];

        victims = victims.filter(victim => this.isAllowed(victim, context)).map(victim => ({
            card: victim.card,
            isBurn: victim.isBurn === true,
            allowSave: victim.allowSave !== false,
            force: victim.force === true,
            player: victim.player || victim.card.controller
        }));

        context.orderedVictims = [];
        context.mainEvent = new GroupedCardEvent('onCharactersKilled', { cards: victims.map(victim => victim.card), victims }, event => this.handleMultipleKills(event, context), () => this.promptForDeadPileOrder(context));

        return victims.reduce((mainEvent, victim) => {
            const event = this.event('onCharacterKilled', Object.assign({ snapshotName: 'cardStateWhenKilled' }, victim), event => {
                this.doKill(event, context);
            });

            const leavePlayEvent = LeavePlay.createEvent({ card: victim.card, allowSave: victim.allowSave });

            mainEvent.addChildEvent(this.atomic(event, leavePlayEvent));

            return mainEvent;
        }, context.mainEvent);
    }

    handleMultipleKills(event, context) {
        for(const victim of event.victims) {
            this.automaticSave(victim.card, victim.force, event, context);
        }
    }

    automaticSave(card, force, event, context) {
        if(card.location !== 'play area') {
            event.saveCard(card);
        } else if(!card.canBeKilled() && !force) {
            context.game.addMessage('{0} controlled by {1} cannot be killed', card, card.controller);
            event.saveCard(card);
        }
    }

    doKill(event, context) {
        let card = event.card;
        let player = card.controller;

        if(card.location !== 'play area') {
            event.cancel();
            return;
        }

        event.cardStateWhenKilled = card.createSnapshot();
        context.game.addMessage('{0} kills {1}', player, card);
    }

    promptForDeadPileOrder(context) {
        for(const player of context.game.getPlayersInFirstPlayerOrder()) {
            this.promptPlayerForDeadPileOrder(player, context);
        }
        this.moveCardsToDeadPile(context);
    }

    promptPlayerForDeadPileOrder(player, context) {
        let victimsOwnedByPlayer = context.mainEvent.cards.filter(
            card => card.owner === player && card.location === 'play area'
        ).map(card => context.mainEvent.victims.find(victim => victim.card === card));

        if(victimsOwnedByPlayer.length <= 1) {
            context.orderedVictims.push(victimsOwnedByPlayer);
            return;
        }

        const orderedVictims = [];
        context.orderedVictims.push(orderedVictims);

        context.game.promptForSelect(player, {
            ordered: true,
            mode: 'exactly',
            numCards: victimsOwnedByPlayer.length,
            activePromptTitle: 'Select order to place cards in dead pile (top first)',
            cardCondition: card => victimsOwnedByPlayer.some(victim => victim.card === card),
            onSelect: (player, selectedCards) => {
                orderedVictims.push(selectedCards.reverse().map(card => victimsOwnedByPlayer.find(victim => victim.card === card)));
                return true;
            },
            onCancel: () => {
                orderedVictims.push(victimsOwnedByPlayer);
                return true;
            }
        });
    }

    moveCardsToDeadPile(context) {
        context.game.queueSimpleStep(() => {
            context.mainEvent.thenAttachEvent(flatten(context.orderedVictims).reduce((mainEvent, victim) => {
                mainEvent.addChildEvent(PlaceCard.createEvent({ card: victim.card, player: victim.player, location: 'dead pile' }));
                return mainEvent;
            }, new SimultaneousEvents()));
        });
    }
}

module.exports = new Kill();
