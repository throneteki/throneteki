import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import Message from '../../Message.js';
import { flatMap } from '../../../Array.js';

class AGiftOfArborRed extends DrawCard {
    // A Gift of Arbor Red (02104)
    // Action: Kneel your faction card to have each player reveal the top 4 cards of his or her
    // deck. Choose 1 card revealed by each player, and add it to that player's hand. Shuffle the
    // other cards back into their owners' decks.
    setupCardAbilities(ability) {
        this.action({
            title: 'Reveal top 4 cards of each deck',
            cost: ability.costs.kneelFactionCard(),
            message:
                "{player} plays {source} and kneels their faction card to reveal the top 4 cards of each player's deck",
            gameAction: GameActions.revealCards((context) => ({
                cards: flatMap(context.game.getPlayers(), (player) => player.searchDrawDeck(4)),
                whileRevealed: GameActions.genericHandler((context) => {
                    this.chooseToAddToHand(context);
                })
            }))
        });
    }

    chooseToAddToHand(context) {
        this.game.promptForSelect(context.player, {
            activePromptTitle: 'Select a card for each player',
            cardCondition: (card) => context.revealed.includes(card),
            mode: 'eachPlayer',
            onSelect: (player, cards) => {
                this.game.addMessage(
                    '{0} {1}. Each player shuffles their deck',
                    player,
                    cards.map((card) =>
                        Message.fragment(
                            `adds {card} to ${player === card.owner ? 'their' : "{owner}'s"} hand`,
                            { card, owner: card.owner }
                        )
                    )
                );
                context.cards = cards;
                this.game.resolveGameAction(
                    GameActions.simultaneously((context) => [
                        ...context.cards.map((card) =>
                            GameActions.addToHand({ card, player: card.owner })
                        ),
                        ...context.game
                            .getPlayers()
                            .map((player) => GameActions.shuffle({ player }))
                    ]),
                    context
                );
                return true;
            },
            onCancel: (player) => {
                this.game.addAlert('danger', '{0} does not select any cards for {1}', player, this);
                return true;
            }
        });
    }
}

AGiftOfArborRed.code = '02104';

export default AGiftOfArborRed;
