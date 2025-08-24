import ChallengeTypes from '../../ChallengeTypes.js';
import PlotCard from '../../plotcard.js';

class BattleBeneathTheWall extends PlotCard {
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
            '{0} uses {1} to have all eligible characters declared as attackers and defenders during {2} challenges until they reveal a new plot',
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
                    challengeType: challengeType
                }),
            match: (card) => card.location === 'play area' && card.getType() === 'character',
            targetController: 'any',
            effect: [
                ability.effects.mustBeDeclaredAsAttacker(),
                ability.effects.mustBeDeclaredAsDefender()
            ]
        }));

        return true;
    }
}

BattleBeneathTheWall.code = '26059';

export default BattleBeneathTheWall;
