import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RecruitFromTheDungeons extends DrawCard {
    // Recruit from the Dungeons (13105)
    // Shadow (2).
    // Action: During a challenge in which you are the defending player, kneel Recruit from the
    // Dungeons to have it participate in the challenge on your side. If you lose the challenge,
    // return Recruit from the Dungeons to shadows.
    setupCardAbilities(ability) {
        this.action({
            title: 'Have character participate in the challenge',
            condition: (context) =>
                context.game.isDuringChallenge({ defendingPlayer: context.player }) &&
                context.source.canParticipateInChallenge(),
            cost: ability.costs.kneelSelf(),
            message:
                '{player} kneels {source} to have {source} participate in the challenge on their side',
            gameAction: GameActions.simultaneously([
                GameActions.addToChallenge((context) => ({ card: context.source })),
                GameActions.delayedEffect({
                    duration: 'untilEndOfChallenge',
                    when: {
                        afterChallenge: (event, context) =>
                            event.challenge.loser === context.player &&
                            context.source.location === 'play area'
                    },
                    message: '{player} returns {source} to shadows after losing the challenge',
                    gameAction: GameActions.putIntoShadows((context) => ({ card: context.source }))
                })
            ])
        });
    }
}

RecruitFromTheDungeons.code = '13105';

export default RecruitFromTheDungeons;
