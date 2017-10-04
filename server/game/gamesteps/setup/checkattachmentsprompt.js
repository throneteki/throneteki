const _ = require('underscore');

const BaseStep = require('../basestep.js');
const AttachmentPrompt = require('../attachmentprompt.js');

class CheckAttachmentsPrompt extends BaseStep {
    constructor(game) {
        super(game);
        this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
    }

    continue() {
        this.remainingPlayers = _.reject(this.remainingPlayers, player => !player.hasUnmappedAttachments());

        if(_.isEmpty(this.remainingPlayers)) {
            return true;
        }

        this.promptPlayerToAttach(this.remainingPlayers[0]);

        return false;
    }

    promptPlayerToAttach(currentPlayer) {
        this.game.promptForSelect(currentPlayer, {
            activePromptTitle: 'Select attachment to attach',
            cardCondition: card => card.location === 'play area' && card.controller === currentPlayer && card.getType() === 'attachment' && !card.parent,
            onSelect: (player, card) => this.onCardClicked(player, card)
        });

        return true;
    }

    onCardClicked(player, card) {
        this.game.queueStep(new AttachmentPrompt(this.game, player, card));
    }
}

module.exports = CheckAttachmentsPrompt;
