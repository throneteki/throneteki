const DrawCard = require('../../../drawcard.js');

class Oathkeeper extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });

        this.reaction({
            when: {
                afterChallenge: (e, challenge) => challenge.winner === this.controller &&
                                                  challenge.strengthDifference >= 5 &&
                                                  challenge.isParticipating(this.parent)
            },
            cost: ability.costs.sacrificeSelf(),
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    activePromptTitle: 'Select a card to add to your hand',
                    cardCondition: card => !card.isFaction('tyrell') && card.getType() === 'character',
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        player.moveCard(card, 'hand');
        this.game.addMessage('{0} sacrifices {1} to search their deck and add {2} to their hand',
            player, this, card);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} sacrifices {1} to search their deck, but does not add any card to their hand',
            player, this);
    }

    canAttach(player, card) {
        if(card.getType() !== 'character') {
            return false;
        }

        return super.canAttach(player, card);
    }
}

Oathkeeper.code = '08005';

module.exports = Oathkeeper;
