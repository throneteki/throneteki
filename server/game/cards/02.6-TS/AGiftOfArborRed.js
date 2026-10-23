import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
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
                whileRevealed: GameActions.simultaneously((context) =>
                    context.game.getPlayersInFirstPlayerOrder().map((owner) =>
                        GameActions.chooseCards({
                            title: `Select a card for ${owner.name}`,
                            cardCondition: (card, context) =>
                                context.revealed.includes(card) && card.owner === owner,
                            gameAction: (card) => GameActions.addToHand({ card, player: owner })
                        })
                    )
                )
            })).then({
                message: 'Then each player shuffles their deck',
                gameAction: GameActions.simultaneously((context) =>
                    context.game.getPlayers().map((player) => GameActions.shuffle({ player }))
                )
            })
        });
    }
}

AGiftOfArborRed.code = '02104';

export default AGiftOfArborRed;
