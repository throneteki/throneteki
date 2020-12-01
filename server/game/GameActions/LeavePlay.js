const GameAction = require('./GameAction');
const ReturnCardToHand = require('./ReturnCardToHand');
const DiscardCard = require('./DiscardCard');

class LeavePlay extends GameAction {
    constructor() {
        super('leavePlay');
    }

    canChangeGameState({ card }) {
        return ['active plot', 'faction', 'play area', 'title'].includes(card.location);
    }

    createEvent({ card, allowSave = false }) {
        const params = {
            card,
            allowSave,
            automaticSaveWithDupe: true,
            snapshotName: 'cardStateWhenLeftPlay'
        };

        return this.event('onCardLeftPlay', params, event => {
            event.card.leavesPlay();

            for(const attachment of event.card.attachments || []) {
                event.thenAttachEvent(this.removeAttachmentEvent(attachment));
            }

            for(const dupe of event.card.dupes || []) {
                event.thenAttachEvent(DiscardCard.createEvent({ card: dupe, allowSave: false }));
            }
        });
    }

    removeAttachmentEvent(attachment) {
        attachment.isBeingRemoved = true;

        if(attachment.isTerminal()) {
            return DiscardCard.createEvent({ card: attachment }).thenExecute(() => {
                attachment.isBeingRemoved = false;
            });
        }

        return ReturnCardToHand.createEvent({ card: attachment }).thenExecute(() => {
            attachment.isBeingRemoved = false;
        });
    }
}

module.exports = new LeavePlay();
