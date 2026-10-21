import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class TheRedWedding extends PlotCard {
    // The Red Wedding (06080)
    // Interrupt: When you win a challenge as the attacking player, choose and kill a Lord or Lady
    // character controlled by the losing opponent. (Any player may initiate this ability.)
    setupCardAbilities() {
        this.interrupt({
            when: {
                afterChallenge: (event) =>
                    event.challenge.attackingPlayer === event.challenge.winner
            },
            player: () => this.game.currentChallenge.winner,
            target: {
                activePromptTitle: 'Choose a Lord or Lady',
                cardCondition: (card, context) =>
                    card.getType() === 'character' &&
                    card.controller !== context.player &&
                    (card.hasTrait('Lord') || card.hasTrait('Lady')) &&
                    card.location === 'play area'
            },
            message: '{player} uses {source} to kill {target}',
            gameAction: GameActions.kill((context) => ({ card: context.target }))
        });
    }
}

TheRedWedding.code = '06080';

export default TheRedWedding;
