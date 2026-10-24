import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class TheBoneway extends DrawCard {
    // The Boneway (02056)
    // Reaction: After you lose a challenge, place 1 vengeance token on The Boneway.
    // Dominance Action: Kneel The Boneway and discard 6 vengeance tokens from it to gain 3 power
    // for your faction.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) => event.challenge.loser === context.player
            },
            message: '{player} uses {source} to place 1 vengeance token on {source}',
            gameAction: GameActions.placeToken((context) => ({
                card: context.source,
                token: Tokens.vengeance
            }))
        });

        this.action({
            title: 'Gain 3 power for your faction',
            phase: 'dominance',
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.discardTokenFromSelf(Tokens.vengeance, 6)
            ],
            message:
                '{player} kneels and discards 6 vengeance tokens from {source} to gain 3 power for their faction',
            gameAction: GameActions.gainPower((context) => ({
                card: context.player.faction,
                amount: 3
            }))
        });
    }
}

TheBoneway.code = '02056';

export default TheBoneway;
