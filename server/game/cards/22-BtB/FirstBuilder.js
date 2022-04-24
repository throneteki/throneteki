const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

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
            gameAction: GameActions.search({
                title: 'Select a card',
                topCards: 10,
                match: {
                    type: ['attachment', 'location'],
                    condition: card => card.hasPrintedCost() && card.getPrintedCost() <= this.getNumberOfBuilders(this.controller),
                },
                message: '{player} uses {source} to search their deck and add {searchTarget} to their hand',
                gameAction: GameActions.addToHand(context => ({
                    card: context.searchTarget
                }))
            })
        });
    }
    
    isBuilderParticipatingInChallenge(player) {
        return player.anyCardsInPlay(card => card.isParticipating() && card.hasTrait('Builder'));
    }
    
    getNumberOfBuilders(player) {
        return player.getNumberOfCardsInPlay(card => card.getType() === 'character' && card.hasTrait('Builder'));
    }
}

FirstBuilder.code = '22015';

module.exports = FirstBuilder;
