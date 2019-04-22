const DrawCard = require('../../drawcard.js');

class StreetOfSilk extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.hasParticipatingLordOrLady()
            },
            cost: ability.costs.kneelFactionCard(),
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    numCards: 5,
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.getType() === 'character' && (card.hasTrait('Ally') || card.hasTrait('Companion')),
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    hasParticipatingLordOrLady() {
        let challenge = this.game.currentChallenge;
        if(!challenge) {
            return false;
        }

        let ourCards = challenge.attackingPlayer === this.controller ? challenge.attackers : challenge.defenders;
        return ourCards.some(card => card.hasTrait('Lord') || card.hasTrait('Lady'));
    }

    cardSelected(player, card) {
        player.moveCard(card, 'hand');
        this.game.addMessage('{0} uses {1} to search their deck and add {2} to their hand',
            player, this, card);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not add any card to their hand',
            player, this);
    }
}

StreetOfSilk.code = '02118';

module.exports = StreetOfSilk;
