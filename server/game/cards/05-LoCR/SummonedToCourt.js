import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';
import Messages from '../../Messages/index.js';

class SummonedToCourt extends PlotCard {
    // Summoned to Court (05048)
    // Forced Interrupt: When the draw phase ends, each player chooses a card in his or her hand, if
    // able. Then, reveal the chosen cards. Each player who revealed a character with the lowest
    // printed cost may put that character into play.
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onPhaseEnded: (event) => event.phase === 'draw'
            },
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                activePromptTitle: 'Choose a card to reveal',
                cardCondition: (card, context) =>
                    card.controller === context.choosingPlayer && card.location === 'hand',
                messages: Messages.eachPlayerSecretTargetingForCardType('card in hand')
            },
            gameAction: GameActions.revealCards((context) => ({
                cards: context.targets.getTargets()
            })).then({
                gameAction: GameActions.simultaneously((context) =>
                    // Characters that left the reveal (Alla Tyrell, Sweetrobin) can't be put into play
                    lowestCostCharacters(context.event.cards)
                        .filter((card) => context.parentContext.revealed.includes(card))
                        .map((character) =>
                            GameActions.may({
                                player: character.controller,
                                title: `Put ${character.name} into play?`,
                                message: {
                                    format: '{controller} {gameAction}',
                                    args: { controller: () => character.controller }
                                },
                                gameAction: GameActions.putIntoPlay({
                                    player: character.controller,
                                    card: character
                                })
                            })
                        )
                )
            })
        });
    }
}

function lowestCostCharacters(cards) {
    const characters = cards.filter((card) => card.getType() === 'character');
    const minCost = Math.min(...characters.map((character) => character.getPrintedCost()));
    return characters.filter((card) => card.getPrintedCost() === minCost);
}

SummonedToCourt.code = '05048';

export default SummonedToCourt;
