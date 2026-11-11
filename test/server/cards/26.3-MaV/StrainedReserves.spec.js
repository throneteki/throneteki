describe('Strained Reserves', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'stark',
                plot: 'Strained Reserves (MaV)',
                gold: 10,
                hand: ['Tumblestone Knight', 'Bastard in Hiding', 'Jousting Pavilion'],
                shadows: ['House Umber Berserkers']
            },
            player2: {
                plot: 'A Song of Summer',
                gold: 10,
                hand: [
                    'House Dayne Knight',
                    'Courtesan of the Rose',
                    'Scouting Vessel',
                    'Little Bird (Core)',
                    'Grand Maester Pycelle (Core)'
                ]
            }
        });
    });

    it('stops a player marshaling more than 2 characters, locations or attachments', function () {
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickCard(this.joustingPavilion);
        this.player1.clickCard(this.bastardInHiding);

        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.joustingPavilion.location).toBe('play area');
        expect(this.bastardInHiding.location).toBe('hand');
        expect(this.player1Object.gold).toBe(8);
        expect(this.player1).isReadyToTakeAction();
    });

    it('counts cards put into play, such as from shadows', function () {
        this.player1.clickCard(this.houseUmberBerserkers);
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.houseUmberBerserkers.location).toBe('play area');
        expect(this.tumblestoneKnight.location).toBe('play area');

        this.player1.clickCard(this.joustingPavilion);

        expect(this.joustingPavilion.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });

    it('lets a player with a Summer plot revealed marshal up to 4', function () {
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.houseDayneKnight);
        this.player2.clickCard(this.courtesanOfTheRose);
        this.player2.clickCard(this.scoutingVessel);
        this.player2.clickCard(this.littleBird);
        this.player2.clickCard(this.houseDayneKnight);
        this.player2.clickCard(this.grandMaesterPycelle);

        expect(this.houseDayneKnight.location).toBe('play area');
        expect(this.courtesanOfTheRose.location).toBe('play area');
        expect(this.scoutingVessel.location).toBe('play area');
        expect(this.littleBird.parent).toBe(this.houseDayneKnight);
        expect(this.grandMaesterPycelle.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });
});
