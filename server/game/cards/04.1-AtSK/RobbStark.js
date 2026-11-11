import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RobbStark extends DrawCard {
    // Robb Stark (04002)
    // Renown.
    // During [military] challenges, Robb Stark gets +1 STR for each loyal character you control.
    // Action: While Robb Stark is participating in a [military] challenge, choose a participating
    // non-King character. Stand and remove that character from the challenge. (Limit once per
    // challenge.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.game.isDuringChallenge({ challengeType: 'military' }),
            match: this,
            effect: ability.effects.dynamicStrength((robb) =>
                robb.controller.getNumberOfCardsInPlay(
                    (card) => card.isLoyal() && card.getType() === 'character'
                )
            )
        });

        this.action({
            title: 'Stand and remove a character from the challenge',
            limit: ability.limit.perChallenge(1),
            condition: (context) =>
                context.game.isDuringChallenge({ challengeType: 'military' }) &&
                context.source.isParticipating(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.hasTrait('King') &&
                    card.isParticipating()
            },
            message: '{player} uses {source} to stand {target} and remove them from the challenge',
            gameAction: GameActions.simultaneously([
                GameActions.standCard((context) => ({ card: context.target })),
                GameActions.removeFromChallenge((context) => ({ card: context.target }))
            ])
        });
    }
}

RobbStark.code = '04002';

export default RobbStark;
