import DrawCard from '../../drawcard.js';

class StannisBaratheon extends DrawCard {
    // Stannis Baratheon (04067)
    // During [power] challenges, each participating non-King character gets -1 STR.
    // Reaction: After you win dominance, choose a non-loyal character. That character cannot stand
    // during the standing phase this round.
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

export default StannisBaratheon;
