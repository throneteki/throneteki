import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NorthernEnvoy extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            chooseOpponent: true,
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.revealTopCards({
                        player: context.opponent,
                        amount: 10,
                        whileRevealed: GameActions.ifCondition({
                            condition: (context) =>
                                context.revealed.some((card) => card.getType() === 'character'),
                            thenAction: GameActions.genericHandler((context) => {
                                this.game.promptForSelect(context.player, {
                                    activePromptTitle: 'Select a character',
                                    cardCondition: (card) =>
                                        context.revealed.includes(card) &&
                                        card.getType() === 'character' &&
                                        !card.isUnique(),
                                    onSelect: (player, card) => {
                                        this.game.resolveGameAction(
                                            GameActions.placeCard({
                                                card,
                                                location: 'discard pile'
                                            })
                                        );
                                        this.game.addMessage(
                                            "{0} chooses to place {1} in {2}'s discard pile",
                                            player,
                                            card,
                                            card.owner
                                        );
                                        return true;
                                    },
                                    onCancel: () => {
                                        return true;
                                    },
                                    source: this
                                });
                            })
                        })
                    }).then({
                        message: '{player} {gameAction}',
                        gameAction: GameActions.shuffle((context) => ({
                            player: context.parentContext.opponent
                        }))
                    })
                );
            }
        });
    }
}

NorthernEnvoy.code = '26049';

export default NorthernEnvoy;
