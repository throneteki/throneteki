import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RandyllTarly extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand Army or reveal top card',
            limit: ability.limit.perPhase(2),
            cost: ability.costs.kneel(
                (card) => card.getType() === 'location' && card.hasTrait('The Reach')
            ),
            message:
                '{player} uses {source} and kneels {costs.kneel} to either stand an Army character, or reveal the top card of their deck',
            gameAction: GameActions.choose({
                choices: {
                    'Stand an Army': {
                        gameAction: GameActions.genericHandler((context) => {
                            this.game.promptForSelect(context.player, {
                                activePromptTitle: 'Select an Army',
                                source: this,
                                cardCondition: (card) =>
                                    card.location === 'play area' &&
                                    card.getType() === 'character' &&
                                    card.hasTrait('Army') &&
                                    card.kneeled,
                                gameAction: 'stand',
                                onSelect: (player, card) => this.onArmySelected(player, card),
                                onCancel: (player) => this.cancelSelection(player)
                            });
                        })
                    },
                    'Reveal top card': {
                        message: '{player} chooses, and {gameAction}',
                        gameAction: GameActions.revealTopCards((context) => ({
                            player: context.player,
                            revealWithMessage: false
                        })).then({
                            condition: (context) =>
                                context.event.cards[0].isMatch({ type: 'location' }) &&
                                context.parentContext.revealed.length > 0,
                            message: '{player} {gameAction}',
                            gameAction: GameActions.ifCondition({
                                condition: (context) =>
                                    context.event.cards[0].isMatch({ trait: 'The Reach' }),
                                thenAction: GameActions.putIntoPlay((context) => ({
                                    card: context.parentContext.revealed[0]
                                })),
                                elseAction: GameActions.drawSpecific((context) => ({
                                    player: context.player,
                                    cards: context.parentContext.revealed
                                }))
                            })
                        })
                    }
                }
            })
        });
    }

    onArmySelected(player, card) {
        this.game.addMessage('{0} chooses to stand {1}', player, card);
        this.game.resolveGameAction(GameActions.standCard({ card }));

        return true;
    }

    cancelSelection(player) {
        this.game.addAlert('danger', '{0} cancels the resolution of {1}', player, this);
        return true;
    }
}

RandyllTarly.code = '19015';

export default RandyllTarly;
