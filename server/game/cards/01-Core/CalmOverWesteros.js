const PlotCard = require('../../plotcard.js');

class CalmOverWesteros extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select a challenge type',
                        buttons: [
                            { text: 'Military', method: 'setChallengeType', arg: 'military' },
                            { text: 'Intrigue', method: 'setChallengeType', arg: 'intrigue' },
                            { text: 'Power', method: 'setChallengeType', arg: 'power' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    setChallengeType(player, challengeType) {
        this.game.addMessage('{0} uses {1} to reduce the claim value of {2} challenges in which they are the defending player by 1 until they reveal a new plot',
            player, this, challengeType);

        this.lastingEffect(ability => ({
            until: {
                onCardEntersPlay: event => event.card.getType() === 'plot' && event.card.controller === player
            },
            condition: () => this.game.currentChallenge && this.game.currentChallenge.challengeType === challengeType &&
                             this.game.currentChallenge.defendingPlayer === player,
            match: card => card === this.game.currentChallenge.attackingPlayer.activePlot,
            targetController: 'any',
            effect: ability.effects.modifyClaim(-1)
        }));

        return true;
    }
}

CalmOverWesteros.code = '01008';

module.exports = CalmOverWesteros;
