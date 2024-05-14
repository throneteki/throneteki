import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WhiteHarbor extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) => event.challenge.winner === this.controller
            },
            message: '{player} uses {source} to reveal the top 2 cards of their deck',
            gameAction: GameActions.revealTopCards((context) => ({
                player: context.player,
                amount: 2,
                whileRevealed: GameActions.genericHandler((context) => {
                    if (context.revealed.length > 0) {
                        this.game.promptForSelect(context.event.challenge.loser, {
                            activePromptTitle: `Select a card to add to ${context.player.name}'s hand`,
                            cardCondition: (card) => context.revealed.includes(card),
                            onSelect: (player, card) => {
                                context.target = card;
                                return true;
                            },
                            onCancel: (player) => {
                                this.game.addAlert(
                                    'danger',
                                    '{0} does not select a card for {1}',
                                    player,
                                    this
                                );
                                return true;
                            }
                        });
                    }
                })
            })).then((preThenContext) => ({
                condition: () => !!preThenContext.target,
                message: {
                    format: "{loser} chooses to add {card} to {player}'s hand",
                    args: {
                        loser: () => preThenContext.event.challenge.loser,
                        card: () => preThenContext.target
                    }
                },
                gameAction: GameActions.simultaneously([
                    GameActions.addToHand({
                        card: preThenContext.target,
                        player: preThenContext.player
                    }),
                    ...preThenContext.revealed
                        .filter((card) => card !== preThenContext.target)
                        .map((card) =>
                            GameActions.placeCard({
                                card,
                                player: preThenContext.player,
                                location: 'draw deck',
                                bottom: true
                            })
                        )
                ])
            }))
        });
    }
}

WhiteHarbor.code = '11042';

export default WhiteHarbor;
