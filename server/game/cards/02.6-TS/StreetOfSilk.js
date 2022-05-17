const DrawCard = require('../../drawcard.js');

class StreetOfSilk extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.hasParticipatingLordOrLady()
            },
            cost: ability.costs.kneelFactionCard(),
            message: '{player} uses {source} and kneels their faction card to search the top 5 cards of their deck for an Ally or Companion card',
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    numCards: 5,
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.getType() === 'character' && (card.hasTrait('Ally') || card.hasTrait('Companion')),
                    onSelect: (player, card, valid) => this.cardSelected(player, card, valid),
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

StreetOfSilk.code = '02118';

module.exports = StreetOfSilk;
