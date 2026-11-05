import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

function anySmallCouncilCharacterInPlay(source) {
    return source.game.anyCardsInPlay(
        (card) => card.hasTrait('Small Council') && card.getType() === 'character'
    );
}

class TheCouncilConsents extends DrawCard {
    // The Council Consents (05044)
    // Reaction: After a player wins an [intrigue] challenge by 5 or more STR, stand each Small
    // Council character.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.strengthDifference >= 5 &&
                    anySmallCouncilCharacterInPlay(context.source)
            },
            message: {
                format: '{player} plays {source} to stand {cards}',
                args: {
                    cards: (context) =>
                        context.game.filterCardsInPlay(
                            (card) =>
                                card.hasTrait('Small Council') && card.getType() === 'character'
                        )
                }
            },
            gameAction: GameActions.simultaneously((context) =>
                context.game
                    .filterCardsInPlay(
                        (card) => card.hasTrait('Small Council') && card.getType() === 'character'
                    )
                    .map((card) => GameActions.standCard({ card }))
            )
        });
    }
}

TheCouncilConsents.code = '05044';

export default TheCouncilConsents;
