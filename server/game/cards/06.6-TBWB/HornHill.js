import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';
import GameActions from '../../GameActions/index.js';

class HornHill extends DrawCard {
    // Horn Hill (06104)
    // Bestow (3).
    // Challenges Action: Kneel Horn Hill to give each participating [tyrell] character you control
    // +X STR until the end of the challenge. X is the number of gold Horn Hill has.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give participating characters +STR',
            phase: 'challenge',
            condition: (context) =>
                context.game.currentChallenge && context.source.hasToken(Tokens.gold),
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to give {cards} +{gold} STR until the end of the challenge',
                args: {
                    cards: (context) =>
                        context.game.currentChallenge.attackers
                            .concat(context.game.currentChallenge.defenders)
                            .filter(
                                (card) =>
                                    card.controller === context.player && card.isFaction('tyrell')
                            ),
                    gold: (context) => context.source.tokens[Tokens.gold]
                }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.game.currentChallenge.attackers
                    .concat(context.game.currentChallenge.defenders)
                    .filter(
                        (card) => card.controller === context.player && card.isFaction('tyrell')
                    ),
                effect: ability.effects.modifyStrength(context.source.tokens[Tokens.gold])
            }))
        });
    }
}

HornHill.code = '06104';

export default HornHill;
