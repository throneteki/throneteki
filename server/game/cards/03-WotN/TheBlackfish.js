import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TheBlackfish extends DrawCard {
    // The Blackfish (03004)
    // Renown.
    // While The Blackfish has 4 or more power, each House Tully character you control does not
    // kneel when declared as an attacker.
    // Reaction: After you win a [military] challenge as the attacking player, draw 1 card. (Limit
    // once per phase.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.getPower() >= 4,
            match: (card) => card.hasTrait('House Tully') && card.getType() === 'character',
            effect: ability.effects.doesNotKneelAsAttacker()
        });

        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.challengeType === 'military' &&
                    event.challenge.isAttackerTheWinner()
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: 1,
                source: context.source
            }))
        });
    }
}

TheBlackfish.code = '03004';

export default TheBlackfish;
