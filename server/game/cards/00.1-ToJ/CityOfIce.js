import PlotCard from '../../plotcard.js';

class CityOfIce extends PlotCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onPhaseStarted']);
    }

    onPhaseStarted() {
        this.triggerCount = 0;
    }

    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    this.triggerCount < this.controller.getNumberOfUsedPlotsByTrait('City') &&
                    event.challenge.winner === this.controller
            },
            player: () =>
                this.game.currentChallenge.winner === this.controller
                    ? this.controller
                    : this.game.currentChallenge.winner,
            target: {
                activePromptTitle: 'Choose an attacking character',
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.location === 'play area' &&
                    card.isAttacking()
            },
            handler: (context) => {
                this.triggerCount++;
                context.target.modifyPower(1);
                this.game.addMessage(
                    '{0} uses {1} to have {2} gain 1 power',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }

    hasUsedCityPlots(player) {
        return player.getNumberOfUsedPlotsByTrait('City') > 0;
    }
}

CityOfIce.code = '00332';

export default CityOfIce;
