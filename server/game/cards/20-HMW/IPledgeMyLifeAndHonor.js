const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class IPledgeMyLifeAndHonor extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Search deck for character',
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && event.challenge.defendingPlayer === this.controller
            },
            handler: context => {
                this.game.promptForDeckSearch(context.player, {
                    numCards: 10,
                    activePromptTitle: 'Select a character',
                    cardCondition: card => card.getType() === 'character' && card.isFaction('thenightswatch') && context.player.canPutIntoPlay(card),
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        this.game.addMessage('{0} uses {1} to search their deck and put {2} into play', player, this, card);
        player.putIntoPlay(card);
        
        this.putIntoPlayCard = card;
        
        this.game.queueSimpleStep(() => {
            this.promptForSacrifice(player); 
        });
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not put any card into play', player, this);
    }

    promptForSacrifice(player) {
        this.game.promptForSelect(player, {
            cardCondition: card => card.location === 'play area' && card.controller === player && card.getTraits().some(trait => this.putIntoPlayCard.hasTrait(trait)) && card.allowGameAction('sacrifice'),
            source: this,
            onSelect: (_, card) => {
                this.game.addMessage('Then {0} sacrifices {1}', player, card);
                player.sacrificeCard(card);

                return true;
            },
            onCancel: () => {
                if(!player.anyCardsInPlay(card => card.getTraits().some(trait => this.putIntoPlayCard.hasTrait(trait)))) {
                    return;
                }

                this.game.addAlert('danger', '{0} cancels the resolution of {1}', player, this);

                return true;
            }
        });
    }
}

IPledgeMyLifeAndHonor.code = '20024';

module.exports = IPledgeMyLifeAndHonor;
