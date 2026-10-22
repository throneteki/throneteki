import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

function isStarkCharacter(source, card) {
    return (
        card.controller === source.controller &&
        card.isFaction('stark') &&
        card.getType() === 'character'
    );
}

function canChangeGameState(source) {
    return source.controller.anyCardsInPlay(
        (card) => card.getType() === 'character' && card.kneeled
    );
}

class RobbStark extends DrawCard {
    // Robb Stark (01146)
    // Renown.
    // Reaction: After a [stark] character you control is sacrificed or killed, stand each character
    // you control. (Limit once per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: (event, context) =>
                    isStarkCharacter(context.source, event.cardStateWhenKilled) &&
                    canChangeGameState(context.source),
                onSacrificed: (event, context) =>
                    isStarkCharacter(context.source, event.cardStateWhenSacrificed) &&
                    canChangeGameState(context.source)
            },
            limit: ability.limit.perRound(1),
            message: '{player} uses {source} to stand each character they control',
            gameAction: GameActions.simultaneously((context) =>
                context.player
                    .filterCardsInPlay((card) => card.getType() === 'character')
                    .map((card) => GameActions.standCard({ card }))
            )
        });
    }
}

RobbStark.code = '01146';

export default RobbStark;
