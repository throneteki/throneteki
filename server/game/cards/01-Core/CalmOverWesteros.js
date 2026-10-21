import PlotCard from '../../plotcard.js';
import ChallengeTypes from '../../ChallengeTypes.js';

class CalmOverWesteros extends PlotCard {
    // Calm Over Westeros (01008)
    // When Revealed: Name a challenge type. Until you reveal a new plot card, reduce the claim
    // value on the attacking player's revealed plot card by 1 during challenges of that type in
    // which you are the defending player.
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

export default CalmOverWesteros;
