const UiPrompt = require('./uiprompt');
const TextHelper = require('../TextHelper');

class AcknowledgeRevealCardsPrompt extends UiPrompt {
    constructor(game, cards, player) {
        super(game);
        this.cards = cards;
        this.revealLocations = [...new Set(cards.map(card => card.location))];
        this.revealingPlayer = player;
        this.opponents = this.game.getPlayers().filter(player => player !== this.revealingPlayer)
        this.clickedButton = { };
    }

    activeCondition(player) {
        return this.opponents.includes(player) && !this.completionCondition(player);
    }

    activePrompt() {
        return {
            promptTitle: `Acknowledge Revealed Card${this.cards.length > 1 ? 's' : ''}`,
            menuTitle: `${this.revealingPlayer.name} is revealing ${TextHelper.count(this.cards.length, 'card')} from their ${this.revealLocations}`,
            buttons: [
                { text: 'Continue' },
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: `Waiting for opponent${this.opponents.length > 1 ? 's' : ''} to acknowledge revealed card${this.cards.length > 1 ? 's' : ''}` };
    }

    onMenuCommand(player) {
        this.clickedButton[player.name] = true;

        return true;
    }

    completionCondition(player) {
        return !!this.clickedButton[player.name];
    }

    isComplete() {
        return this.game.disableRevealAcknowledgement || this.opponents.every(opponent => this.completionCondition(opponent));
    }
}

module.exports = AcknowledgeRevealCardsPrompt;
