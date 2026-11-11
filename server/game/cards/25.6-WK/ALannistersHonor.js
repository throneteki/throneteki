import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class ALannistersHonor extends DrawCard {
    // A Lannister's Honor (25106)
    // Reaction: After you win an [intrigue] challenge as the attacking player, the losing opponent
    // must choose and kill a character with the lowest STR among characters they control. (Max 1
    // per challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        winner: context.source.controller,
                        attackingPlayer: context.source.controller,
                        challengeType: 'intrigue'
                    })
            },
            target: {
                choosingPlayer: (player, context) => player === context.event.challenge.loser,
                cardCondition: {
                    type: 'character',
                    location: 'play area',
                    controller: 'choosingPlayer',
                    condition: (card, context) =>
                        card.getStrength() ===
                            context.source.getLowestStrInPlay(context.event.challenge.loser) &&
                        GameActions.kill({ card }).allow()
                }
            },
            max: ability.limit.perChallenge(1),
            message: {
                format: '{player} plays {source} to have {loser} choose and kill a character they control with the lowest STR',
                args: { loser: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.kill((context) => ({ card: context.target }))
        });
    }

    getLowestStrInPlay(player) {
        let characters = player.filterCardsInPlay({ type: 'character' });
        let strengths = characters.map((card) => card.getStrength());
        return Math.min(...strengths);
    }
}

ALannistersHonor.code = '25106';

export default ALannistersHonor;
