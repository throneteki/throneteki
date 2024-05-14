import DrawCard from '../../drawcard.js';

class WhiteRaven extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.loser === this.controller &&
                    event.challenge.challengeType === 'power'
            },
            handler: () => {
                this.game.addMessage(
                    '{0} is forced by {1} to sacrifice {1}',
                    this.controller,
                    this
                );
                this.controller.sacrificeCard(this);
            }
        });
        this.reaction({
            when: {
                onDominanceDetermined: (event) =>
                    this.controller.canGainFactionPower() &&
                    this.controller === event.winner &&
                    (this.anyPlotHasTrait('Summer') || this.anyPlotHasTrait('Winter'))
            },
            handler: () => {
                this.game.addPower(this.controller, 1);
                this.game.addMessage(
                    '{0} uses {1} to gain 1 power for their faction',
                    this.controller,
                    this
                );
            }
        });
    }

    anyPlotHasTrait(trait) {
        return this.game.getNumberOfPlotsWithTrait(trait) > 0;
    }
}

WhiteRaven.code = '04008';

export default WhiteRaven;
