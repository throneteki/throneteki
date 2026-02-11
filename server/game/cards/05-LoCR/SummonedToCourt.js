import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';
import Messages from '../../Messages/index.js';

class SummonedToCourt extends PlotCard {
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
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.revealCards((context) => ({
                        cards: context.targets.getTargets()
                    })).then({
                        gameAction: GameActions.simultaneously((context) =>
                            // Get the lowest cost characters that were revealed, but filter out any characters who are not still in reveal location (eg. Alla Tyrell or Sweetrobin)
                            this.getLowestCostCharacters(context.event.cards)
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
                    }),
                    context
                );
            }
        });
    }

    getLowestCostCharacters(cards) {
        let characters = cards.filter((card) => card.getType() === 'character');
        let minCost = Math.min(...characters.map((character) => character.getPrintedCost()));
        return characters.filter((card) => card.getPrintedCost() === minCost);
    }
}

SummonedToCourt.code = '05048';

export default SummonedToCourt;
