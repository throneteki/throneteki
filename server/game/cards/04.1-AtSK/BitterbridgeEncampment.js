import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BitterbridgeEncampment extends DrawCard {
    // Bitterbridge Encampment (04005)
    // Reaction: After a Summer plot card is revealed, kneel Bitterbridge Encampment. Then, each
    // player may put a character into play from his or her hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                onPlotsRevealed: (event) => event.plots.some((plot) => plot.hasTrait('Summer'))
            },
            message:
                '{player} kneels {source} to have each player put a character into play from their hand',
            gameAction: GameActions.kneelCard((context) => ({ card: context.source })).then({
                gameAction: GameActions.chooseCards({
                    players: (context) => context.game.getPlayersInFirstPlayerOrder(),
                    mode: 'upTo',
                    numCards: 1,
                    title: 'Select a character to put into play',
                    cardCondition: (card, context) =>
                        card.controller === context.choosingPlayer &&
                        card.getType() === 'character' &&
                        card.location === 'hand',
                    gameAction: (card) => GameActions.putIntoPlay({ player: card.controller, card })
                })
            })
        });
    }
}

BitterbridgeEncampment.code = '04005';

export default BitterbridgeEncampment;
