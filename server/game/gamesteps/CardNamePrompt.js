import BaseStep from './basestep.js';

class CardNamePrompt extends BaseStep {
    constructor(game, { player, source, title, match, onSelect, onCancel }) {
        super(game);

        this.player = player;
        this.source = source;
        this.title = title || 'Name a card';
        this.match = match || (() => true);
        this.onSelect = onSelect;
        this.onCancel = onCancel;
        this.cards = Object.values(this.game.cardData);
    }

    continue() {
        this.game.promptWithMenu(this.player, this, {
            activePrompt: {
                menuTitle: this.title,
                controls: [
                    { type: 'card-name', command: 'menuButton', method: 'handleSelectCardName' }
                ]
            },
            source: this.source
        });
    }

    handleSelectCardName(player, cardName) {
        if (!cardName || cardName.length === 0) {
            this.handleCancel();
            return true;
        }

        if (!this.isMatch(cardName)) {
            return false;
        }

        this.onSelect(player, cardName);

        return true;
    }

    isMatch(cardName) {
        return this.cards.some((cardData) => cardData.name === cardName && this.match(cardData));
    }

    handleCancel() {
        if (this.onCancel) {
            this.onCancel();
        } else {
            this.game.addAlert(
                'warning',
                '{0} does not name a card for {1}',
                this.player,
                this.source
            );
        }
    }
}

export default CardNamePrompt;
