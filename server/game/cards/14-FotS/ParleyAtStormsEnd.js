import PlotCard from '../../plotcard.js';
import ChallengeTypes from '../../ChallengeTypes.js';

class ParleyAtStormsEnd extends PlotCard {
    // Parley at Storm's End (14046)
    // When Revealed: Name a challenge type. Until you reveal a new plot card, challenges of that
    // type cannot be initiated.
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

export default ParleyAtStormsEnd;
