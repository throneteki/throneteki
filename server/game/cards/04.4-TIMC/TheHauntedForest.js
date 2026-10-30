import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheHauntedForest extends DrawCard {
    // The Haunted Forest (04066)
    // While The Haunted Forest is standing, it contributes 1 STR to your side during any challenge
    // in which you are the defending player.
    // Forced Reaction: After you lose a challenge, kneel The Haunted Forest.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                !context.source.kneeled &&
                context.game.isDuringChallenge({ defendingPlayer: context.source.controller }),
            targetController: 'current',
            effect: ability.effects.contributeStrength(this, 1)
        });
        this.forcedReaction({
            when: {
                afterChallenge: (event, context) =>
                    context.source.controller === event.challenge.loser && !context.source.kneeled
            },
            message: '{player} is forced to kneel {source}',
            gameAction: GameActions.kneelCard((context) => ({ card: context.source }))
        });
    }
}

TheHauntedForest.code = '04066';

export default TheHauntedForest;
