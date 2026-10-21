describe('Brave Companions (HMW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [{ card: 'Tumblestone Knight', gold: 1 }],
                hand: ['Brave Companions (HMW)'],
                drawDeck: [
                    'Vanguard of the North',
                    'Ser Denys Mallister',
                    'Devout Freerider',
                    'House Maester'
                ]
            }
        });

        this.player1.clickCard(this.braveCompanions);
        this.player1.clickPrompt('Done');
    });

    it('gets +1 STR for each character you control with gold, and searches for an Army, a Commander and a Mercenary after you marshal it', function () {
        expect(this.braveCompanions.getStrength()).toBe(4);

        this.player1.triggerAbility(this.braveCompanions);

        expect(this.player1).not.toBeAbleToSelect(this.houseMaester);

        this.player1.clickCard(this.vanguardOfTheNorth);
        this.player1.clickCard(this.serDenysMallister);
        this.player1.clickCard(this.devoutFreerider);
        this.player1.clickPrompt('Done');

        expect(this.vanguardOfTheNorth.location).toBe('hand');
        expect(this.serDenysMallister.location).toBe('hand');
        expect(this.devoutFreerider.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
