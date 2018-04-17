const DrawCard = require('../../drawcard.js');

class NoUseForGrief extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);
        this.tracker = new KillTracker(this.game, this.controller);
    }

    setupCardAbilities() {
        this.action({
            title: 'Put Sand Snake into play',
            condition: () => this.tracker.isMartellCharacterKilledThisRound,
            handler: context => {
                let costLimit = context.player.deadPile.some(card => card.name === 'The Red Viper') ? 6 : 3;

                this.game.promptForDeckSearch(context.player, {
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.hasTrait('Sand Snake') && card.getType() === 'character' && card.getCost() <= costLimit,
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        player.putIntoPlay(card);
        this.game.addMessage('{0} plays {1} to search their deck and put {2} into play',
            player, this, card);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} plays {1} to search their deck, but does not put any card into play',
            player, this);
    }
}

class KillTracker {
    constructor(game, player) {
        this.isMartellCharacterKilledThisRound = false;
        game.on('onCharacterKilled', event => {
            if(event.cardStateWhenKilled.isFaction('martell') && event.cardStateWhenKilled.controller === player) {
                this.isMartellCharacterKilledThisRound = true;
            }
        });
        game.on('onRoundEnded', () => this.isMartellCharacterKilledThisRound = false);
    }
}

NoUseForGrief.code = '10022';

module.exports = NoUseForGrief;
