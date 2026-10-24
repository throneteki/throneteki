import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RhllorInfiltrator extends DrawCard {
    // R'hllor Infiltrator (13007)
    // Dominance Action: Kneel R'hllor Infiltrator to choose an opponent. Give control of R'hllor
    // Infiltrator to that player and gain 1 power for your faction.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give control and gain 1 power',
            phase: 'dominance',
            chooseOpponent: true,
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to give control of {source} to {opponent} and gain 1 power',
                args: { opponent: (context) => context.opponent }
            },
            gameAction: GameActions.simultaneously([
                GameActions.takeControl((context) => ({
                    player: context.opponent,
                    card: context.source
                })),
                GameActions.gainPower((context) => ({ card: context.player.faction, amount: 1 }))
            ])
        });
    }
}

RhllorInfiltrator.code = '13007';

export default RhllorInfiltrator;
