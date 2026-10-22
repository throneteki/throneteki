import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OlennasInformant extends DrawCard {
    // Olenna's Informant (01189)
    // Ambush (4).
    // Reaction: After Olenna's Informant enters play during the challenges phase, name a challenge
    // type. You may initiate an additional challenge of that type this phase.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card === context.source && context.game.currentPhase === 'challenge'
            },
            gameAction: GameActions.chooseChallengeType({
                title: 'Name a challenge type',
                message:
                    '{player} uses {source} to be able to initiate an additional {challengeType} challenge this phase',
                gameAction: (challengeType) =>
                    GameActions.lastingEffect(() => ({
                        duration: 'untilEndOfPhase',
                        targetController: 'current',
                        effect: ability.effects.mayInitiateAdditionalChallenge(challengeType)
                    }))
            })
        });
    }
}

OlennasInformant.code = '01189';

export default OlennasInformant;
