import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GhostOfHighHeart extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                !this.controller.anyCardsInPlay(
                    (card) => card.getType() === 'character' && card.isLoyal()
                ),
            match: (card) => card.getType() === 'character',
            targetController: 'current',
            effect: ability.effects.modifyStrength(1)
        });

        this.action({
            title: 'Look at hand',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            choosePlayer: (player) => player.hand.length > 0,
            message: "{player} kneels {source} to look at {chosenPlayer}'s hand",
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.lookAtHand((context) => ({
                        player: context.player,
                        opponent: context.chosenPlayer
                    })).then({
                        target: {
                            activePromptTitle: 'Select a card',
                            cardCondition: (card, context) =>
                                card.location === 'hand' &&
                                (!context.parentContext.chosenPlayer ||
                                    card.controller === context.parentContext.chosenPlayer),
                            revealTargets: true
                        },
                        message: 'Then {player} uses {source} to discard {target}',
                        handler: (thenContext) => {
                            this.game
                                .resolveGameAction(
                                    GameActions.discardCard({ card: thenContext.target })
                                )
                                .thenExecute(() => {
                                    if (context.chosenPlayer.canDraw()) {
                                        this.game.addMessage(
                                            'Then {0} draws 1 card',
                                            context.chosenPlayer
                                        );
                                        context.chosenPlayer.drawCardsToHand(1);
                                    }
                                });
                        }
                    }),
                    context
                );
            }
        });
    }
}

GhostOfHighHeart.code = '13037';

export default GhostOfHighHeart;
