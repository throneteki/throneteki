const PlotCard = require('../../plotcard');
const ChallengeTypes = require('../../ChallengeTypes');

class ParleyAtStormsEnd extends PlotCard {
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
        this.game.addMessage('{0} uses {1} to prevent {2} challenges', player, this, challengeType);

        this.lastingEffect((ability) => ({
            until: {
                onCardEntersPlay: (event) =>
                    event.card.getType() === 'plot' && event.card.controller === player
            },
            targetController: 'any',
            effect: ability.effects.cannotInitiateChallengeType(challengeType)
        }));

        return true;
    }
}

ParleyAtStormsEnd.code = '14046';

module.exports = ParleyAtStormsEnd;
