import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Kingswood extends DrawCard {
    // Kingswood (02087)
    // During [power] challenges in which you are the defending player, each attacking character
    // gets -1 STR.
    // Forced Reaction: After you lose a [power] challenge, sacrifice Kingswood.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.game.isDuringChallenge({
                    challengeType: 'power',
                    defendingPlayer: context.source.controller
                }),
            match: (card) => card.isAttacking(),
            targetController: 'any',
            effect: ability.effects.modifyStrength(-1)
        });

        this.forcedReaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.loser === context.source.controller &&
                    event.challenge.challengeType === 'power'
            },
            message: '{player} is forced to sacrifice {source}',
            gameAction: GameActions.sacrificeCard((context) => ({ card: context.source }))
        });
    }
}

Kingswood.code = '02087';

export default Kingswood;
