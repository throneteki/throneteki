class PlayerPromptState {
    constructor() {
        this.isActivePrompt = false;
        this.selectCard = false;
        this.selectOrder = false;
        this.selectFiresOnClick = false;
        this.menuTitle = '';
        this.promptTitle = '';
        this.buttons = [];
        this.controls = [];

        this.selectableCards = [];
        this.selectedCards = [];
    }

    setSelectedCards(cards) {
        this.selectedCards = cards || [];
    }

    clearSelectedCards() {
        this.selectedCards = [];
    }

    setSelectableCards(cards) {
        this.selectableCards = cards || [];
    }

    clearSelectableCards() {
        this.selectableCards = [];
    }

    setIsActive(isActive) {
        this.isActivePrompt = isActive;
    }

    setPrompt(prompt) {
        this.selectCard = prompt.selectCard || false;
        this.selectOrder = prompt.selectOrder || false;
        this.selectFiresOnClick = prompt.selectFiresOnClick || false;
        this.menuTitle = prompt.menuTitle || '';
        this.promptTitle = prompt.promptTitle;
        this.buttons = (prompt.buttons || []).map((button) => {
            if (button.card) {
                let card = button.card;
                let properties = Object.assign({}, button);
                delete properties['card'];
                return Object.assign(
                    { text: card.name, arg: card.uuid, card: card.getShortSummary() },
                    properties
                );
            }

            return button;
        });
        this.controls = prompt.controls || [];
    }

    cancelPrompt() {
        this.selectCard = false;
        this.selectFiresOnClick = false;
        this.menuTitle = '';
        this.buttons = [];
        this.controls = [];
    }

    getCardSelectionState(card, player) {
        let selectable = this.selectableCards.includes(card);
        let index = this.selectedCards.indexOf(card);
        let result = {
            // The `card.selected` property here is a hack for plot selection,
            // which we do differently from normal card selection. The chosen
            // plot stays secret until revealed, so only its owner sees it.
            selected: (card.selected && card.owner === player) || index !== -1,
            selectable: selectable,
            unselectable: this.selectCard && !selectable
        };

        if (index !== -1 && this.selectOrder) {
            return Object.assign({ order: index + 1 }, result);
        }

        return result;
    }

    getState() {
        return {
            isActivePrompt: this.isActivePrompt,
            selectCard: this.selectCard,
            selectOrder: this.selectOrder,
            selectFiresOnClick: this.selectFiresOnClick,
            menuTitle: this.menuTitle,
            promptTitle: this.promptTitle,
            buttons: this.buttons.map((button) => this.getButtonState(button)),
            controls: this.controls
        };
    }

    getButtonState(button) {
        if (button.disabled) {
            let disabled =
                typeof button.disabled === 'function' ? button.disabled() : button.disabled;
            return Object.assign({}, button, { disabled: !!disabled });
        }

        return button;
    }
}

export default PlayerPromptState;
