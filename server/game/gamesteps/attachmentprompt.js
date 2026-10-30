import UiPrompt from './uiprompt.js';
import GameActions from '../GameActions/index.js';

class AttachmentPrompt extends UiPrompt {
    constructor(game, player, attachmentCard, playingType, targets, options = {}, event) {
        super(game);
        this.event = event;
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
                if (this.event) {
                    this.attachToEvent(player, card);
                    return true;
                }

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

    attachToEvent(player, card) {
        this.event.thenAttachEvent(
            GameActions.attach({
                ...this.options,
                player,
                attachment: this.attachmentCard,
                target: card,
                playingType: this.playingType
            })
                .createEvent()
                .thenExecute(() => {
                    this.game.addMessage(
                        '{0} attaches {1} to {2}',
                        player,
                        this.attachmentCard,
                        card
                    );
                })
        );
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
