const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class GrowingStrong extends DrawCard {

    canPlay() {
        if(this.game.currentPhase !== 'challenge') {
            return false;
        }
        return true;
    }

    play() {
        this.waitingPrompt = 'Waiting for opponent to use ' + this.name;
        this.game.promptForSelect(this.controller, {
            numCards: 3,
            activePromptTitle: 'Select Tyrell characters to buff',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => {
                return card.getFaction() === this.getFaction() && card.getType() === 'character';
            },
            onSelect: (player, cards) => this.onSelect(player, cards),
            onCancel: (player) => this.cancelSelection(player)
        });
    }
    onSelect(player, cards) {
        _.each(cards, card => 
            card.untilEndOfChallenge(ability => ({
                match: card,
                effect: ability.effects.modifyStrength(2)
            })));
        var buffedCards = _.map(cards, card => card.name);
        this.game.addMessage('{0} uses {1} to give +2 STR to {2}',
                             player, this, buffedCards.join(' and '));
        return true;
    }

    cancelSelection(player) {
        this.game.addMessage('{0} cancels the resolution of {1}', player, this);
    }
}

GrowingStrong.code = '01195';

module.exports = GrowingStrong;
