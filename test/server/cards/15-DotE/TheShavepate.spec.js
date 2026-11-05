describe('The Shavepate', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['The Shavepate', 'House Maester'],
                hand: ['Viserys Targaryen (Core)'],
                discard: [
                    'Vale Refugee',
                    'Handmaiden',
                    'Drogon (Core)',
                    'Ranging Party',
                    'The Roseroad'
                ],
                gold: 3
            },
            player2: { discard: ['Hedge Knight'] }
        });
    });

    it('pays X gold and can select only your discarded characters costing X or less', function () {
        this.player1.clickCard(this.theShavepate);
        this.player1.selectValue('3');
        for (const card of [this.valeRefugee, this.handmaiden, this.drogon]) {
            expect(this.player1).toBeAbleToSelect(card);
        }
        for (const card of [
            this.rangingParty,
            this.theRoseroad,
            this.hedgeKnight,
            this.viserysTargaryen,
            this.houseMaester,
            this.theShavepate
        ]) {
            expect(this.player1).not.toBeAbleToSelect(card);
        }
        this.player1.clickCard(this.drogon);
        expect(this.drogon.location).toBe('play area');
        expect(this.drogon.kneeled).toBe(false);
        expect(this.player1Object.gold).toBe(0);
        for (const card of [
            this.valeRefugee,
            this.handmaiden,
            this.rangingParty,
            this.theRoseroad,
            this.hedgeKnight
        ]) {
            expect(card.location).toBe('discard pile');
        }
        expect(this.player1.actionUnavailableReason(this.theShavepate)).toBe('limit');
        expect(this.player1).isReadyToTakeAction();
    });

    it('with X zero cannot use remaining gold to select a more expensive character', function () {
        this.player1.clickCard(this.theShavepate);
        this.player1.selectValue('0');
        expect(this.player1).toBeAbleToSelect(this.valeRefugee);
        for (const card of [this.handmaiden, this.drogon, this.rangingParty]) {
            expect(this.player1).not.toBeAbleToSelect(card);
        }
        this.player1.clickCard(this.valeRefugee);
        expect(this.valeRefugee.location).toBe('play area');
        expect(this.player1Object.gold).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });

    it('may pay more than a selected character costs', function () {
        this.player1.clickCard(this.theShavepate);
        this.player1.selectValue('3');
        this.player1.clickCard(this.handmaiden);
        expect(this.handmaiden.location).toBe('play area');
        expect(this.player1Object.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('The Shavepate restrictions', function () {
    it('cannot use the action during marshaling', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['The Shavepate'], discard: ['Handmaiden'] }
        });
        expect(this.player1.actionUnavailableReason(this.theShavepate)).toBe('phase');
        expect(this.player1).isReadyToTakeAction();
    });

    it('cannot use the action when no discarded character is affordable', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The Shavepate'], discard: ['Handmaiden'], gold: 1 }
        });
        expect(this.player1.actionUnavailableReason(this.theShavepate)).toBe('target');
        expect(this.player1).isReadyToTakeAction();
    });
});
