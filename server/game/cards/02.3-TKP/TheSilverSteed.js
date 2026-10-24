import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheSilverSteed extends DrawCard {
    // The Silver Steed (02054)
    // Dothraki character or Daenerys Targaryen only.
    // While attached character is participating in a [power] challenge, it gains renown.
    // Reaction: After attached character gains power using renown, sacrifice The Silver Steed.
    // Then, you may initiate an additional [power] challenge this phase.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Dothraki' }, { name: 'Daenerys Targaryen' });
        this.whileAttached({
            condition: (context) =>
                context.game.isDuringChallenge({ challengeType: 'power' }) &&
                context.source.parent.isParticipating(),
            effect: ability.effects.addKeyword('Renown')
        });
        this.reaction({
            when: {
                onCardPowerGained: (event, context) =>
                    event.card === context.source.parent && event.reason === 'renown'
            },
            message: '{player} sacrifices {source}',
            gameAction: GameActions.sacrificeCard((context) => ({ card: context.source })).then({
                message:
                    'Then {player} is able to initiate an additional power challenge this phase',
                gameAction: GameActions.lastingEffect(() => ({
                    duration: 'untilEndOfPhase',
                    targetController: 'current',
                    effect: ability.effects.mayInitiateAdditionalChallenge('power')
                }))
            })
        });
    }
}

TheSilverSteed.code = '02054';

export default TheSilverSteed;
