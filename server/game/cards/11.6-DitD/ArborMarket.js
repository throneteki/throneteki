import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class ArborMarket extends DrawCard {
    // Arbor Marketplace (11104)
    // Challenges Action: Kneel Arbor Marketplace to choose a participating character. Until the end
    // of the challenge, that character gets +1 STR.
    // +1 Income.
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });

        this.action({
            title: 'Give character +1 STR',
            cost: ability.costs.kneelSelf(),
            condition: (context) => context.game.isDuringChallenge(),
            phase: 'challenge',

            target: {
                cardCondition: (card) => card.location === 'play area' && card.isParticipating()
            },
            message:
                '{player} kneels {source} to give +1 STR to {target} until the end of the challenge',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.target,
                effect: ability.effects.modifyStrength(1)
            }))
        });
    }
}

ArborMarket.code = '11104';

export default ArborMarket;
