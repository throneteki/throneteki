const DrawCard = require('../../drawcard.js');

class Oathkeeper extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });

        this.reaction({
            when: {
                afterChallenge: event =>
                    event.challenge.winner === this.controller &&
                    event.challenge.strengthDifference >= 5 &&
                    event.challenge.isParticipating(this.parent)
            },
            cost: ability.costs.sacrificeSelf(),
            message: '{player} sacrifices {costs.sacrifice} to search their deck for a non-Tyrell character',
            handler: context => {
                this.game.promptForDeckSearch(context.player, {
                    activePromptTitle: 'Select a card',
                    cardCondition: card => !card.isFaction('tyrell') && card.getType() === 'character',
                    onSelect: (player, card, valid) => this.cardSelected(player, card, valid),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card, valid) {
        if(valid) {
            player.moveCard(card, 'hand');
            this.game.addMessage('{0} adds {1} to their hand',
                player, card);
        }
    }

    doneSelecting(player) {
        this.game.addMessage('{0} does not add any card to their hand',
            player);
    }
}

Oathkeeper.code = '08005';

module.exports = Oathkeeper;
