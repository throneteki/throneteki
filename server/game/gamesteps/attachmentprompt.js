import UiPrompt from './uiprompt.js';

class AttachmentPrompt extends UiPrompt {
    constructor(game, player, attachmentCard, playingType, targets, options = {}) {
        super(game);
        this.player = player;
        this.attachmentCard = attachmentCard;
        this.playingType = playingType;
        this.targets = targets || (() => true);
        this.options = options;
    }

    continue() {
        this.game.promptForSelect(this.player, {
            activePromptTitle: 'Select target for attachment',
            cardCondition: (card) =>
                this.player.canAttach(this.attachmentCard, card) &&
                this.setupRestriction(card) &&
                this.targets(card),
            onSelect: (player, card) => {
                let targetPlayer = card.controller;
                targetPlayer.attach(
                    player,
                    this.attachmentCard,
                    card,
                    this.playingType,
                    false,
                    this.options
                );
                return true;
            }
        });
    }

    setupRestriction(card) {
        return this.game.currentPhase === 'setup'
            ? card.controller === this.attachmentCard.controller
            : true;
    }

    getPlayer() {
        return this.player;
    }
}

export default AttachmentPrompt;
