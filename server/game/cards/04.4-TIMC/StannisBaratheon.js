const DrawCard = require('../../drawcard.js');

class StannisBaratheon extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ challengeType: 'power' }),
            match: (card) => card.isParticipating() && !card.hasTrait('King'),
            targetController: 'any',
            effect: ability.effects.modifyStrength(-1)
        });

        this.reaction({
            when: {
                onDominanceDetermined: (event) => this.controller === event.winner
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.isLoyal()
            },
            handler: (context) => {
                this.untilEndOfRound((ability) => ({
                    condition: () => this.game.currentPhase === 'standing',
                    match: context.target,
                    effect: ability.effects.cannotBeStood()
                }));

                this.game.addMessage(
                    '{0} uses {1} to make {2} unable to stand during the standing phase this round',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

StannisBaratheon.code = '04067';

module.exports = StannisBaratheon;
