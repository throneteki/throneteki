import TextHelper from '../TextHelper.js';
import UiPrompt from './uiprompt.js';

class AcknowledgeRevealCardsPrompt extends UiPrompt {
    constructor(game, cards, player, source) {
        super(game);
        this.cards = cards;
        this.revealLocations = [...new Set(cards.map((card) => card.location))];
        this.revealers = player ? [player] : [...new Set(cards.map((card) => card.controller))];
        this.acknowledged = new Set(this.revealers);
        this.source = source;
    }

    activeCondition(player) {
        return !this.completionCondition(player);
    }

    activePrompt() {
        return {
            promptTitle: `Acknowledge Revealed Card${this.cards.length > 1 ? 's' : ''}`,
            menuTitle: this.buildTitle(),
            buttons: [{ text: 'Continue' }]
        };
    }

    waitingPrompt() {
        return {
            menuTitle: `Waiting for other player(s) to acknowledge revealed card${this.cards.length > 1 ? 's' : ''}`
        };
    }

    onMenuCommand(player) {
        this.acknowledged.add(player);

        return true;
    }

    completionCondition(player) {
        return this.acknowledged.has(player);
    }

    isComplete() {
        return (
            this.game.disableRevealAcknowledgement ||
            this.game.getPlayers().every((player) => this.completionCondition(player))
        );
    }

    buildTitle() {
        if (this.revealers.length > 1) {
            return 'Multiple players are revealing cards';
        }

        let elements = [
            this.revealers[0].name,
            'is revealing',
            this.cards.length === 1 ? this.cards[0].name : 'cards',
            'from their',
            TextHelper.formatList(this.revealLocations, 'and')
        ];

        if (this.source) {
            elements.push(`for ${this.source.name}`);
        }
        return elements.join(' ');
    }
}

export default AcknowledgeRevealCardsPrompt;
