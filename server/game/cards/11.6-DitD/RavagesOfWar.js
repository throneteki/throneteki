import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';
import Messages from '../../Messages/index.js';

class RavagesOfWar extends PlotCard {
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
            handler: (context) => {
                let actions = [];

                for (let player of this.game.getPlayersInFirstPlayerOrder()) {
                    let targets = context.targets.getTargetsForPlayer(player);
                    this.game.addMessage(
                        '{0} sacrifices {1}, discards {2} from hand, and discards {3} from shadows for {4}',
                        player,
                        targets.sacrifice || 'nothing',
                        targets.hand || 'nothing',
                        targets.shadows || 'nothing',
                        this
                    );

                    if (targets.sacrifice) {
                        actions.push(
                            GameActions.sacrificeCard({ player, card: targets.sacrifice })
                        );
                    }

                    if (targets.hand) {
                        actions.push(GameActions.discardCard({ card: targets.hand }));
                    }

                    if (targets.shadows) {
                        actions.push(GameActions.discardCard({ card: targets.shadows }));
                    }
                }

                this.game.resolveGameAction(GameActions.simultaneously(actions));
            }
        });
    }
}
RavagesOfWar.code = '11120';

export default RavagesOfWar;
