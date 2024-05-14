import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TheBlackfish extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.getPower() >= 4,
            match: (card) => card.hasTrait('House Tully') && card.getType() === 'character',
            effect: ability.effects.doesNotKneelAsAttacker()
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'military' &&
                    event.challenge.isAttackerTheWinner()
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: 1,
                source: this
            }))
        });
    }
}

TheBlackfish.code = '03004';

export default TheBlackfish;
