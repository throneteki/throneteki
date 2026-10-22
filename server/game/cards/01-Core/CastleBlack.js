import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CastleBlack extends DrawCard {
    // Castle Black (01136)
    // Action: Kneel Castle Black to choose and stand a defending [thenightswatch] character. Until
    // the end of the challenge, that character gets +2 STR.
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand and give defending character +2 STR',
            condition: (context) => context.game.isDuringChallenge(),
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isFaction('thenightswatch') &&
                    card.isDefending()
            },
            message:
                '{player} kneels {source} to stand and give +2 STR to {target} until the end of the challenge',
            gameAction: GameActions.simultaneously([
                GameActions.standCard((context) => ({ card: context.target })),
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfChallenge',
                    match: context.target,
                    effect: ability.effects.modifyStrength(2)
                }))
            ])
        });
    }
}

CastleBlack.code = '01136';

export default CastleBlack;
