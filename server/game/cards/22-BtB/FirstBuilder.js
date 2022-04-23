const DrawCard = require('../../drawcard.js');

class FirstBuilder extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ unique: true, controller: 'current' });
        this.whileAttached({
            effect: [
                ability.effects.addIcon('power'),
                ability.effects.addTrait('Builder')
            ]
        });
        
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && event.challenge.challengeType === 'power' && this.isBuilderParticipatingInChallenge(this.controller)
            },
            limit: ability.limit.perPhase(1),
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    numCards: 10,
                    activePromptTitle: 'Select a card',
                    cardCondition: card => (card.getType() === 'attachment' || card.getType() === 'location') && card.getPrintedCost() <= this.getNumberOfBuilders(this.controller),
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }
    
    isBuilderParticipatingInChallenge(player) {
        return player.anyCardsInPlay(card => card.isParticipating() && card.hasTrait('Builder'));
    }
    
    getNumberOfBuilders(player) {
        return player.getNumberOfCardsInPlay(card => card.getType() === 'character' && card.hasTrait('Builder'));
    }

    cardSelected(player, card) {
        this.game.addMessage('{0} uses {1} to search their deck, and add {2} to their hand',
            player, this, card);
        player.moveCard(card, 'hand');
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not add any card to their hand',
            player, this);
    }
}

FirstBuilder.code = '22015';

module.exports = FirstBuilder;
