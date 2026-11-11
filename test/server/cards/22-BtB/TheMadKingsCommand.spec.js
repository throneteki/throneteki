describe("The Mad King's Command", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: "The Mad King's Command (BtB)",
                inPlay: [
                    { card: 'Hedge Knight', attachments: ['Little Bird (Core)'] },
                    { card: 'Grand Maester Pycelle (Core)', dupes: 1 },
                    'Tumblestone Knight',
                    'Old Gate'
                ],
                hand: ['Nightmares'],
                shadows: ['House Umber Berserkers']
            },
            player2: {
                inPlay: ['Bastard in Hiding', 'The Roseroad'],
                hand: ['Tithe']
            }
        });

        this.dupe = this.grandMaesterPycelle.dupes[0];
    });

    it('has each player choose up to 3 cards of each type to keep', function () {
        expect(this.player1).toHavePrompt('Select up to 3 characters');
        expect(this.player1).toBeAbleToSelect(this.hedgeKnight);
        expect(this.player1).toBeAbleToSelect(this.tumblestoneKnight);
        expect(this.player1).toBeAbleToSelect(this.bastardInHiding);
        expect(this.player1).not.toBeAbleToSelect(this.oldGate);
        expect(this.player1).not.toBeAbleToSelect(this.littleBird);

        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.littleBird);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.oldGate);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.nightmares);
        this.player1.clickCard(this.houseUmberBerserkers);
        this.player1.clickPrompt('Done');

        expect(this.player2).toHavePrompt('Select up to 3 characters');
        expect(this.player2).toBeAbleToSelect(this.bastardInHiding);
        expect(this.player2).toBeAbleToSelect(this.hedgeKnight);

        this.player2.clickCard(this.bastardInHiding);
        this.player2.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        this.player2.clickCard(this.theRoseroad);
        this.player2.clickPrompt('Done');
        this.player2.clickCard(this.tithe);
        this.player2.clickPrompt('Done');

        expect(this.hedgeKnight.location).toBe('play area');
        expect(this.littleBird.location).toBe('play area');
        expect(this.oldGate.location).toBe('play area');
        expect(this.nightmares.location).toBe('hand');
        expect(this.houseUmberBerserkers.location).toBe('shadows');
        expect(this.bastardInHiding.location).toBe('play area');
        expect(this.theRoseroad.location).toBe('play area');
        expect(this.tithe.location).toBe('hand');
        this.player1.clickPrompt('Done');
        expect(this.player1).isReadyToTakeAction();
    });

    it("places each card not chosen on the bottom of its owner's deck, which cannot be saved", function () {
        for (const player of [this.player1, this.player2]) {
            expect(player).toHavePrompt('Select up to 3 characters');
            player.clickPrompt('Done');
            expect(player).toHavePrompt('Select up to 3 attachments');
            player.clickPrompt('Done');
            expect(player).toHavePrompt('Select up to 3 locations');
            player.clickPrompt('Done');
            expect(player).toHavePrompt('Select up to 3 cards');
            player.clickPrompt('Done');
        }
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');

        expect(this.hedgeKnight.location).toBe('draw deck');
        expect(this.grandMaesterPycelle.location).toBe('draw deck');
        expect(this.dupe.location).toBe('discard pile');
        expect(this.tumblestoneKnight.location).toBe('draw deck');
        expect(this.oldGate.location).toBe('draw deck');
        expect(this.nightmares.location).toBe('draw deck');
        expect(this.houseUmberBerserkers.location).toBe('draw deck');
        expect(this.littleBird.location).not.toBe('play area');
        expect(this.bastardInHiding.location).toBe('draw deck');
        expect(this.theRoseroad.location).toBe('draw deck');
        expect(this.tithe.location).toBe('draw deck');
        expect(this.player1).isReadyToTakeAction();
    });
});
