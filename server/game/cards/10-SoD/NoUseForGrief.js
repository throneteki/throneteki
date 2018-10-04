const DrawCard = require('../../drawcard');
const KillTracker = require('../../EventTrackers/KillTracker');

class NoUseForGrief extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);
        this.tracker = new KillTracker(this.game);
    }

    setupCardAbilities() {
        this.action({
            title: 'Put Sand Snake into play',
            condition: () => this.tracker.anyKilledThisRound(card => card.isFaction('martell') && card.controller === this.controller),
            handler: context => {
                let costLimit = context.player.deadPile.some(card => card.name === 'The Red Viper') ? 6 : 3;

                this.game.promptForDeckSearch(context.player, {
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.hasTrait('Sand Snake') && card.getType() === 'character' && card.getPrintedCost() <= costLimit,
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

NoUseForGrief.code = '10022';

module.exports = NoUseForGrief;
