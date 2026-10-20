describe('The King in the North', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'The King in the North (R)',
                hand: ['Tithe', 'Hedge Knight'],
                inPlay: [
                    'Old Forest Hunter',
                    'Renly Baratheon (FotS)',
                    'Dornish Fiefdom',
                    'House Maester'
                ]
            },
            player2: {
                inPlay: ['Dornish Fiefdom']
            }
        });

        this.player1Location = this.player1.findCardByName('Dornish Fiefdom');
        this.player2Location = this.player2.findCardByName('Dornish Fiefdom');
    });

    it('stops abilities on characters, locations and attachments without the King or Queen trait', function () {
        expect(this.player1.actionUnavailableReason(this.oldForestHunter)).toBe('cannotTrigger');
        expect(this.player1.actionUnavailableReason(this.player1Location)).toBe('cannotTrigger');
        expect(this.player1Object.gold).toBe(5);

        this.player1.clickPrompt('Done');

        expect(this.player2.actionUnavailableReason(this.player2Location)).toBe('cannotTrigger');
        expect(this.player2).isReadyToTakeAction();
    });

    it('does not stop an event', function () {
        this.player1.clickCard(this.tithe);
        this.player1.clickCard(this.houseMaester);

        expect(this.houseMaester.kneeled).toBe(true);
        expect(this.player1Object.gold).toBe(7);
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not stop an ability on a King character', function () {
        this.player1.clickMenu(this.renlyBaratheon, 'Put character into play');
        this.player1.clickCard(this.hedgeKnight);

        expect(this.hedgeKnight.location).toBe('play area');
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
