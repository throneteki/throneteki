import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class QueensMen extends DrawCard {
    // Queen's Men (08008)
    // Reaction: After you marshal Queen's Men, choose an opponent and look at his or her hand.
    // Then, you may kneel a non-[baratheon] character to choose and discard 1 non-character card
    // from that hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card === context.source && event.playingType === 'marshal'
            },
            chooseOpponent: (opponent) => opponent.hand.length !== 0,
            message: "{player} uses {source} to look at {opponent}'s hand",
            gameAction: GameActions.lookAtHand((context) => ({
                player: context.player,
                opponent: context.opponent
            })).then({
                condition: (context) =>
                    context.player.anyCardsInPlay((card) => canKneel(card, context.player)) &&
                    context.parentContext.opponent.hand.some(
                        (card) => card.getType() !== 'character'
                    ),
                target: {
                    optional: true,
                    activePromptTitle: 'Select a non-character, or click done',
                    revealTargets: true,
                    cardCondition: (card, context) =>
                        card.location === 'hand' &&
                        card.controller === context.parentContext.opponent &&
                        card.getType() !== 'character'
                },
                gameAction: GameActions.ifCondition({
                    condition: (context) => !!context.target,
                    thenAction: GameActions.chooseCards({
                        title: 'Select a character to kneel',
                        cardCondition: (card, context) => canKneel(card, context.player),
                        gameAction: (card, context) =>
                            GameActions.simultaneously([
                                GameActions.kneelCard({ card }),
                                GameActions.discardCard({ card: context.target })
                            ])
                    })
                })
            })
        });
    }
}

function canKneel(card, player) {
    return (
        card.location === 'play area' &&
        card.controller === player &&
        !card.isFaction('baratheon') &&
        card.getType() === 'character' &&
        !card.kneeled
    );
}

QueensMen.code = '08008';

export default QueensMen;
