import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class StoneCrows extends DrawCard {
    // Stone Crows (06009)
    // Ambush (3). Bestow (2).
    // Reaction: After you win a challenge in which Stone Crows is attacking, discard 1 gold from it
    // to have the losing opponent choose and kill a defending character.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player && context.source.isAttacking()
            },
            cost: ability.costs.discardGold(),
            message: {
                format: '{player} discards 1 gold from {source} to have {loser} choose and kill a defending character',
                args: { loser: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.chooseCards({
                player: (context) => context.event.challenge.loser,
                title: 'Select a character to kill',
                cardCondition: (card) => card.getType() === 'character' && card.isDefending(),
                gameAction: (card) => GameActions.kill({ card })
            })
        });
    }
}

StoneCrows.code = '06009';

export default StoneCrows;
