import PlotCard from '../../plotcard.js';

class TheRedWedding extends PlotCard {
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
            handler: (context) => {
                this.game.killCharacter(context.target);
                this.game.addMessage(
                    '{0} uses {1} to kill {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

TheRedWedding.code = '06080';

export default TheRedWedding;
