const PlotCard = require('../../plotcard.js');
const GameActions = require('../../GameActions/index.js');
const Messages = require('../../Messages');

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
                messages: Messages.eachPlayerSecretTargetingForCardType('card in hand')
            },
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.revealCards(context => ({ cards: context.targets.getTargets() }))
                        .then(context => ({
                            gameAction: GameActions.simultaneously(
                                this.getLowestCostCharacters(context.revealed).map(character => 
                                    GameActions.may({
                                        player: character.controller,
                                        title: `Put ${character.name} into play?`,
                                        message: {
                                            format: '{controller} {gameAction}',
                                            args: { controller: () => character.controller }
                                        },
                                        gameAction: GameActions.putIntoPlay({ player: character.controller, card: character })
                                    })
                                )
                            )
                        })),
                    context
                );
            }
        });
    }

    getLowestCostCharacters(revealed) {
        let characters = revealed.filter(card => card.getType() === 'character');
        let minCost = Math.min(...characters.map(character => character.getPrintedCost()));
        return characters.filter(card => card.getPrintedCost() === minCost);
    }
}

SummonedToCourt.code = '05048';

module.exports = SummonedToCourt;
