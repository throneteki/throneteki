describe('Sea Song', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Sea Song', 'The Reader (TRtW)'],
                hand: Array(8).fill('House Dayne Knight')
            }
        });

        this.completeChallengesPhase();
        this.player1.discardToReserve();
    });

    it('gives The Reader insight', function () {
        expect(this.theReader.hasKeyword('Insight')).toBe(true);

        this.player1.clickPrompt('Pass');

        expect(this.player1).isReadyToTakeAction();
    });

    it('draws 1 card or gains 1 power after cards are discarded for reserve', function () {
        const power = this.player1Object.faction.power;
        this.player1.triggerAbility(this.seaSong);
        this.player1.clickPrompt('Gain 1 power');

        expect(this.player1Object.faction.power).toBe(power + 1);
        expect(this.player1).isReadyToTakeAction();
    });
});
