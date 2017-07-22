const DrawCard = require('../../../drawcard.js');

class StannisBaratheon extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'power'),
            match: (card) => this.game.currentChallenge.isParticipating(card) && !card.hasTrait('King'),
            targetController: 'any',
            effect: ability.effects.modifyStrength(-1),
            recalculateWhen: ['onAttackersDeclared', 'onDefendersDeclared']
        });

        this.reaction({
            when: {
                onDominanceDetermined: (event, winner) => this.controller === winner
            },
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' &&
                                       !card.isLoyal()
            },
            handler: context => {
                this.untilEndOfRound(ability => ({
                    condition: () => this.game.currentPhase === 'standing',
                    match: context.target,
                    effect: ability.effects.cannotBeStood()
                }));

                this.game.addMessage('{0} uses {1} to make {2} unable to stand during the standing phase this round', 
                    this.controller, this, context.target);
            }
        });
    }
}

StannisBaratheon.code = '04067';

module.exports = StannisBaratheon;
