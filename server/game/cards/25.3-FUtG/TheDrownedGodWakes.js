import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheDrownedGodWakes extends DrawCard {
    // The Drowned God Wakes (25044)
    // Reaction: After you win dominance by 10 or more STR, each player chooses a character they
    // control, if able. Kill each character not chosen.
    setupCardAbilities() {
        this.reaction({
            when: {
                onDominanceDetermined: (event, context) =>
                    context.player === event.winner && event.difference >= 10
            },
            message:
                '{player} plays {source} to have each player choose a character they control, and kill the others',
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.choosingPlayer
            },
            gameAction: GameActions.simultaneously((context) =>
                context.game
                    .filterCardsInPlay(
                        (card) =>
                            !context.targets.getTargets().includes(card) &&
                            card.getType() === 'character'
                    )
                    .map((card) => GameActions.kill({ card }))
            )
        });
    }
}

TheDrownedGodWakes.code = '25044';

export default TheDrownedGodWakes;
