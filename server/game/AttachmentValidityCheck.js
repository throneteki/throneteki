const _ = require('underscore');

class AttachmentValidityCheck {
    constructor(game) {
        this.game = game;
        this.beingDiscarded = [];
    }

    enforceValidity() {
        let invalidAttachments = this.filterInvalidAttachments();
        let needsDiscard = _.difference(invalidAttachments, this.beingDiscarded);

        if(needsDiscard.length === 0) {
            return;
        }

        this.beingDiscarded = this.beingDiscarded.concat(needsDiscard);

        this.game.queueSimpleStep(() => {
            for(let [owner, cards] of this.groupAttachmentsByOwner(needsDiscard)) {
                owner.discardCards(cards, false);
            }

        });
        this.game.queueSimpleStep(() => {
            this.beingDiscarded = _.difference(this.beingDiscarded, needsDiscard);
        });
    }

    filterInvalidAttachments() {
        let attachmentsInPlay = this.game.filterCardsInPlay(card => card.parent && card.getType() === 'attachment' && !card.isBeingRemoved);
        return attachmentsInPlay.filter(card => !card.controller.canAttach(card, card.parent));
    }

    groupAttachmentsByOwner(cards) {
        return cards.reduce((map, card) => {
            let cardsForOwner = map.get(card.owner) || [];
            map.set(card.owner, cardsForOwner.concat([card]));
            return map;
        }, new Map());
    }
}

module.exports = AttachmentValidityCheck;
