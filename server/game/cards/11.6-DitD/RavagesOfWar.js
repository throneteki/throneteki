import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';
import Messages from '../../Messages/index.js';

class RavagesOfWar extends PlotCard {
    // Ravages of War (11120)
    // When Revealed: Each player sacrifices a character or location, chooses and discards 1 card
    // from his or her hand, and chooses and discards 1 card from his or her shadows area, if able.
    setupCardAbilities() {
        this.whenRevealed({
            targets: {
                sacrifice: {
                    choosingPlayer: 'each',
                    ifAble: true,
                    type: 'select',
                    activePromptTitle: 'Select a card',
                    cardCondition: (card, context) =>
                        card.location === 'play area' &&
                        ['character', 'location'].includes(card.getType()) &&
                        card.controller === context.choosingPlayer,
                    gameAction: 'sacrifice',
                    messages: Messages.eachPlayerTargetingForCardType('cards to sacrifice')
                },
                hand: {
                    choosingPlayer: 'each',
                    ifAble: true,
                    activePromptTitle: 'Select a card',
                    cardCondition: (card, context) =>
                        card.location === 'hand' && card.controller === context.choosingPlayer,
                    gameAction: 'discard',
                    messages: Messages.eachPlayerSecretTargetingForCardType('cards in hand')
                },
                shadows: {
                    choosingPlayer: 'each',
                    ifAble: true,
                    activePromptTitle: 'Select a card',
                    cardCondition: (card, context) =>
                        card.location === 'shadows' && card.controller === context.choosingPlayer,
                    gameAction: 'discard',
                    messages: Messages.eachPlayerSecretTargetingForCardType('cards in shadow')
                }
            },
            message:
                '{player} uses {source} to have each player sacrifice a character or location, and discard a card from their hand and a card from their shadows area',
            gameAction: GameActions.simultaneously((context) =>
                context.game.getPlayersInFirstPlayerOrder().flatMap((player) => {
                    const targets = context.targets.getTargetsForPlayer(player);
                    return [
                        targets.sacrifice &&
                            GameActions.sacrificeCard({ player, card: targets.sacrifice }),
                        targets.hand && GameActions.discardCard({ card: targets.hand }),
                        targets.shadows && GameActions.discardCard({ card: targets.shadows })
                    ].filter(Boolean);
                })
            )
        });
    }
}
RavagesOfWar.code = '11120';

export default RavagesOfWar;
