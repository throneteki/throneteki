const BaseStep = require('../basestep');

class ChooseParticipantsPrompt extends BaseStep {
    constructor(game, choosingPlayer, properties) {
        super(game);

        this.game = game;
        this.choosingPlayer = choosingPlayer;
        this.limits = choosingPlayer[properties.limitsProperty];
        this.properties = properties;
        this.challengeType = properties.challengeType;
        this.onSelect = properties.onSelect || (() => true);
    }

    continue() {
        let forcedParticipants = this.choosingPlayer.filterCardsInPlay(card => this.isRequiredParticipant(card));
        let participantMax = this.limits.getMax();

        if(forcedParticipants.length !== 0) {
            if(forcedParticipants.length <= participantMax || participantMax === 0) {
                let message = forcedParticipants.length === 1 ? this.properties.messages.autoDeclareSingular : this.properties.messages.autoDeclarePlural;
                this.game.addMessage(message, forcedParticipants);
            }
        }

        this.game.promptForSelect(this.choosingPlayer, {
            numCards: participantMax,
            multiSelect: true,
            activePromptTitle: this.getPromptTitle(),
            waitingPromptTitle: this.properties.waitingPromptTitle,
            cardCondition: card => this.canParticipate(card),
            mustSelect: forcedParticipants,
            onSelect: (player, participants) => this.chooseParticipants(participants),
            onCancel: () => this.chooseParticipants([])
        });
    }

    canParticipate(card) {
        return card.controller === this.choosingPlayer &&
            card.getType() === 'character' &&
            card.canDeclareAsParticipant(this.challengeType) &&
            card.allowGameAction(this.properties.gameAction) &&
            !card.isParticipating();
    }

    isRequiredParticipant(card) {
        return this.canParticipate(card) && card.challengeOptions.contains(this.properties.mustBeDeclaredOption);
    }

    getPromptTitle() {
        let title = this.properties.activePromptTitle;
        let max = this.limits.getMax();
        let min = this.limits.getMin();
        let restrictions = [];

        if(min !== 0) {
            restrictions.push(`min ${min}`);
        }

        if(max !== 0) {
            restrictions.push(`max ${max}`);
        }

        if(restrictions.length !== 0) {
            title += ` (${restrictions.join(', ')})`;
        }

        return title;
    }

    chooseParticipants(participants) {
        if(!this.hasMetParticipantMinimum(participants)) {
            let min = this.limits.getMin();
            let message = min === 1 ? this.properties.messages.notEnoughSingular : this.properties.messages.notEnoughPlural;
            this.game.addAlert('danger', message, this.choosingPlayer, min);
        }

        this.onSelect(participants);
        return true;
    }

    hasMetParticipantMinimum(participants) {
        let min = this.limits.getMin();

        if(min === 0) {
            return true;
        }

        let eligibleParticipants = this.choosingPlayer.getNumberOfCardsInPlay(card => this.canParticipate(card));
        let actualMinimum = Math.min(min, eligibleParticipants);

        return participants.length >= actualMinimum;
    }
}

module.exports = ChooseParticipantsPrompt;
