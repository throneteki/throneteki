import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class StannisBaratheon extends DrawCard {
    // Stannis Baratheon (04067)
    // During [power] challenges, each participating non-King character gets -1 STR.
    // Reaction: After you win dominance, choose a non-loyal character. That character cannot stand
    // during the standing phase this round.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.game.isDuringChallenge({ challengeType: 'power' }),
            match: (card) => card.isParticipating() && !card.hasTrait('King'),
            targetController: 'any',
            effect: ability.effects.modifyStrength(-1)
        });

        this.reaction({
            when: {
                onDominanceDetermined: (event, context) =>
                    context.source.controller === event.winner
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.isLoyal()
            },
            message:
                '{player} uses {source} to make {target} unable to stand during the standing phase this round',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfRound',
                condition: () => context.game.currentPhase === 'standing',
                match: context.target,
                effect: ability.effects.cannotBeStood()
            }))
        });
    }
}

StannisBaratheon.code = '04067';

export default StannisBaratheon;
