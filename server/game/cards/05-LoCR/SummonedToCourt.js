const PlotCard = require('../../plotcard.js');
const GameActions = require('../../GameActions/index.js');
const { flatMap } = require('../../../Array.js');

class SummonedToCourt extends PlotCard {
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onPhaseEnded: event => event.phase === 'draw'
            },
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                activePromptTitle: 'Choose a card to reveal',
                cardCondition: (card, context) => card.controller === context.choosingPlayer && card.location === 'hand',
                messages: {
                    selected: '{targetSelection.choosingPlayer} chooses a card in hand to reveal for {source}',
                    unable: '{targetSelection.choosingPlayer} has no card to choose for {source}',
                    noneSelected: '{targetSelection.choosingPlayer} chooses no card for {source}',
                    skipped: {
                        type: 'danger',
                        format: '{targetSelection.choosingPlayer} has a card to choose for {source} but did not choose any'
                    }
                }
            },
            handler: context => {
                let selections = context.targets.selections.filter(selection => !!selection.value);
                this.game.resolveGameAction(
                    GameActions.revealCards({
                        cards: flatMap(selections, selection => selection.value)
                    }).then({
                        handler: context => {
                            let characters = context.event.revealed.filter(card => card.getType() === 'character');
                            let minCost = Math.min(...characters.map(character => character.getPrintedCost()));
                            let lowestRevealed = characters.filter(card => card.getPrintedCost() === minCost);

                            for(let character of lowestRevealed) {
                                let mayContext = {...context, player: character.controller, card: character };
                                this.game.resolveGameAction(GameActions.may({
                                    title: context => `Put ${context.card.name} into play?`,
                                    message: {
                                        format: '{player} puts {card} into play',
                                        args: { card: context => context.card }
                                    },
                                    gameAction: GameActions.putIntoPlay(context => ({
                                        player: context.player,
                                        card: context.card
                                    }))
                                }), mayContext);
                            }
                        }
                    }),
                    context
                );
            }
        });
    }
}

SummonedToCourt.code = '05048';

module.exports = SummonedToCourt;
