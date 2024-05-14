const DrawCard = require('../../drawcard');

class SerMandonMoore extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            chooseOpponent: (player) => this.hasKillableCharacter(player),
            message: {
                format: '{player} uses {source} to force {opponent} to discard 2 cards or kill a character',
                args: { opponent: (context) => context.opponent }
            },
            handler: (context) => {
                let opponent = context.opponent;

                if (opponent.hand.length < 2) {
                    this.promptToKillCharacter(opponent);
                    return;
                }

                this.game.promptWithMenu(opponent, this, {
                    activePrompt: {
                        menuTile: '',
                        buttons: [
                            { text: 'Discard 2 cards', method: 'promptToDiscard' },
                            { text: 'Kill character', method: 'promptToKillCharacter' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    hasKillableCharacter(player) {
        return player.anyCardsInPlay(
            (card) => card.getType() === 'character' && card.canBeKilled()
        );
    }

    promptToDiscard(opponent) {
        this.game.promptForSelect(opponent, {
            mode: 'exactly',
            numCards: 2,
            activePrompt: 'Select 2 cards',
            cardCondition: (card) => card.controller === opponent && card.location === 'hand',
            onSelect: (opponent, cards) => this.discardSelectedCards(opponent, cards),
            onCancel: (opponent) => this.promptToKillCharacter(opponent),
            source: this
        });
        return true;
    }

    discardSelectedCards(opponent, cards) {
        this.game.addMessage('{0} discards {1} for {2}', opponent, cards, this);
        opponent.discardCards(cards);
        return true;
    }

    promptToKillCharacter(opponent) {
        this.game.promptForSelect(opponent, {
            activePromptTitle: 'Select character',
            cardCondition: (card) =>
                card.getType() === 'character' &&
                card.location === 'play area' &&
                card.controller === opponent,
            gameAction: 'kill',
            onSelect: (opponent, card) => this.killSelectedCharacter(opponent, card),
            onCancel: (opponent) => this.cancelResolution(opponent),
            source: this
        });
        return true;
    }

    killSelectedCharacter(opponent, card) {
        this.game.addMessage('{0} chooses to kill {1} for {2}', opponent, card, this);
        this.game.killCharacter(card);
        return true;
    }

    cancelResolution(player) {
        this.game.addAlert('danger', '{0} cancels resolution of {1}', player, this);
        return true;
    }
}

SerMandonMoore.code = '13009';

module.exports = SerMandonMoore;
