import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GhostOfHighHeart extends DrawCard {
    // Ghost of High Heart (13037)
    // While you control no loyal characters, each character you control gets +1 STR.
    // Challenges Action: Kneel Ghost of High Heart to look at a player's hand. Choose and discard 1
    // card from that hand. Then, that player draws 1 card.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                !context.source.controller.anyCardsInPlay(
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
            gameAction: GameActions.lookAtHand((context) => ({
                player: context.player,
                opponent: context.chosenPlayer
            })).then({
                target: {
                    activePromptTitle: 'Select a card',
                    cardCondition: (card, context) =>
                        card.location === 'hand' &&
                        card.controller === context.parentContext.chosenPlayer,
                    revealTargets: true
                },
                message: 'Then {player} uses {source} to discard {target}',
                gameAction: GameActions.discardCard((context) => ({ card: context.target })).then({
                    message: {
                        format: 'Then {chosenPlayer} draws 1 card',
                        args: {
                            chosenPlayer: (context) =>
                                context.parentContext.parentContext.chosenPlayer
                        }
                    },
                    gameAction: GameActions.drawCards((context) => ({
                        player: context.parentContext.parentContext.chosenPlayer,
                        amount: 1
                    }))
                })
            })
        });
    }
}

GhostOfHighHeart.code = '13037';

export default GhostOfHighHeart;
