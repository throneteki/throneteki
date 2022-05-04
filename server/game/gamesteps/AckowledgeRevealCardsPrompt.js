const UiPrompt = require('./uiprompt');
const TextHelper = require('../../game/TextHelper');

class AckowledgeRevealCardsPrompt extends UiPrompt {
    constructor(game, cards, player) {
        super(game);
        this.cards = cards;
        this.revealingPlayer = player;
        this.clickedButton = {};
    }
    
    activeCondition(player) {
        return !this.completionCondition(player);
    }

    activePrompt() {
        return {
            promptTitle: 'Revealing Card(s)',
            menuTitle: `${this.revealingPlayer.name} is revealing ${TextHelper.count(this.cards.length, 'card')}`,
            buttons: [
                { text: 'Continue' },
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent(s) to choose to continue' };
    }

    onMenuCommand(player) {
        this.clickedButton[player.name] = true;

        return true;
    }

    completionCondition(player) {
        return !!this.clickedButton[player.name];
    }

    isComplete() {
        return this.game.getPlayers().every(player => this.completionCondition(player));
    }
}

module.exports = AckowledgeRevealCardsPrompt;
