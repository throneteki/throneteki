const TextHelper = require('../TextHelper');
const UiPrompt = require('./uiprompt');

class AcknowledgeRevealCardsPrompt extends UiPrompt {
    constructor(game, cards, player, source) {
        super(game);
        this.cards = cards;
        this.revealLocations = [...new Set(cards.map(card => card.location))];
        this.revealers = player ? [player] : [...new Set(cards.map(card => card.controller))];
        this.acknowledgers = this.game.getPlayers().filter(player => cards.some(card => card.controller !== player));
        this.source = source;
        this.clickedButton = { };
    }

    activeCondition(player) {
        return this.acknowledgers.includes(player) && !this.completionCondition(player);
    }

    activePrompt() {
        return {
            promptTitle: `Acknowledge Revealed Card${this.cards.length > 1 ? 's' : ''}`,
            menuTitle: this.buildTitle(),
            buttons: [
                { text: 'Continue' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: `Waiting for other player(s) to acknowledge revealed card${this.cards.length > 1 ? 's' : ''}` };
    }

    onMenuCommand(player) {
        this.clickedButton[player.name] = true;

        return true;
    }

    completionCondition(player) {
        return !!this.clickedButton[player.name];
    }

    isComplete() {
        return this.game.disableRevealAcknowledgement || this.acknowledgers.every(acknowledger => this.completionCondition(acknowledger));
    }

    buildTitle() {
        if(this.revealers.length > 1) {
            return 'Multiple players are revealing cards';
        }

        let elements = [
            this.revealers[0].name,
            'is revealing',
            this.cards.length === 1 ? this.cards[0].name : 'cards',
            'from their',
            TextHelper.formatList(this.revealLocations, 'and')
        ];

        if(this.source) {
            elements.push(`for ${this.source.name}`);
        }
        return elements.join(' ');
    }
}

module.exports = AcknowledgeRevealCardsPrompt;
