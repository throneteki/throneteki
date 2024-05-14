const PlotCard = require('../../plotcard.js');
const ChallengeTypes = require('../../ChallengeTypes');

class CalmOverWesteros extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: (context) => {
                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Select a challenge type',
                        buttons: ChallengeTypes.asButtons({ method: 'setChallengeType' })
                    },
                    source: this
                });
            }
        });
    }

    setChallengeType(player, challengeType) {
        this.game.addMessage(
            '{0} uses {1} to reduce the claim value of {2} challenges in which they are the defending player by 1 until they reveal a new plot',
            player,
            this,
            challengeType
        );

        this.lastingEffect((ability) => ({
            until: {
                onCardEntersPlay: (event) =>
                    event.card.getType() === 'plot' && event.card.controller === player
            },
            condition: () =>
                this.game.isDuringChallenge({
                    challengeType: challengeType,
                    defendingPlayer: player
                }),
            match: (card) =>
                this.game.currentChallenge &&
                card === this.game.currentChallenge.attackingPlayer.activePlot,
            targetController: 'any',
            effect: ability.effects.modifyClaim(-1)
        }));

        return true;
    }
}

CalmOverWesteros.code = '01008';

module.exports = CalmOverWesteros;
