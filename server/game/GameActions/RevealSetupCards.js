import GameAction from './GameAction.js';
import TextHelper from '../TextHelper.js';

class RevealSetupCards extends GameAction {
    constructor() {
        super('revealSetupCards');
    }

    createEvent({ game }) {
        const players = game.getPlayers();
        const cards = players.flatMap((player) =>
            player.cardsInPlay.filter((card) => card.facedown)
        );
        return this.event('onSetupCardsRevealed', { cards }, () => {
            for (const player of players) {
                const revealed = player.cardsInPlay.filter((card) => card.facedown);
                player.flipSetupCardsFaceUp();
                if (player.shadows.length > 0) {
                    revealed.push(
                        `${TextHelper.count(player.shadows.length, 'card')} into shadows`
                    );
                }
                if (revealed.length === 0) {
                    game.addMessage('{0} does not set up any cards', player);
                } else {
                    game.addMessage('{0} sets up {1}', player, revealed);
                }
            }
        });
    }
}

export default new RevealSetupCards();
