import range from 'lodash.range';
import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';
import GameActions from '../../GameActions/index.js';

class LannisportTreasury extends DrawCard {
    // Lannisport Treasury (05019)
    // Reaction: After the taxation phase begins, place 1 gold from your gold pool on Lannisport
    // Treasury.
    // Marshaling Action: Kneel Lannisport Treasury to move any number of gold from Lannisport
    // Treasury to your gold pool.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'taxation'
            },
            message: '{player} moves 1 gold from their gold pool to {source}',
            gameAction: GameActions.transferGold((context) => ({
                from: context.player,
                to: context.source,
                amount: 1
            }))
        });
        this.action({
            title: 'Move gold to gold pool',
            phase: 'marshal',
            condition: (context) => context.source.hasToken(Tokens.gold),
            cost: ability.costs.kneelSelf(),
            gameAction: GameActions.choose({
                title: 'Select gold amount',
                message: '{player} moves {choice} gold from {source} to their gold pool',
                choices: (context) =>
                    Object.fromEntries(
                        range(1, context.source.tokens[Tokens.gold] + 1)
                            .reverse()
                            .map((amount) => [
                                `${amount}`,
                                GameActions.transferGold((context) => ({
                                    from: context.source,
                                    to: context.player,
                                    amount
                                }))
                            ])
                    )
            })
        });
    }
}

LannisportTreasury.code = '05019';

export default LannisportTreasury;
