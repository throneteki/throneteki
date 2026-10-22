describe('Black Betha', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Black Betha', 'Ser Davos Seaworth (Core)', 'Khal Drogo (Core)'] },
            player2: { inPlay: [{ card: 'Tumblestone Knight', kneeling: true }] }
        });
        expect(this.serDavosSeaworth.hasKeyword('renown')).toBe(true);
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.khalDrogo);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.blackBetha);
        this.player1.clickCard(this.khalDrogo);
    });

    it('gives Ser Davos Seaworth renown, and kneels to give an attacking character +1 STR for each kneeling character the defending player controls', function () {
        expect(this.khalDrogo.getStrength()).toBe(6);
        expect(this.player2).isReadyToTakeAction();
    });
});
