const UiPrompt = require('./uiprompt.js');

class AttachmentPrompt extends UiPrompt {
    constructor(game, player, attachmentCard, playingType) {
        super(game);
        this.player = player;
        this.attachmentCard = attachmentCard;
        this.playingType = playingType;
    }

    continue() {
        this.game.promptForSelect(this.player, {
            activePromptTitle: 'Select target for attachment',
            cardCondition: card => this.player.canAttach(this.attachmentCard, card) && this.setupRestriction(card),
            onSelect: (player, card) => {
                let targetPlayer = card.controller;
                targetPlayer.attach(player, this.attachmentCard, card, this.playingType);
                return true;
            }
        });
    }

    setupRestriction(card) {
        return this.game.currentPhase === 'setup' ? card.controller === this.attachmentCard.controller : true;
    }
}

module.exports = AttachmentPrompt;
