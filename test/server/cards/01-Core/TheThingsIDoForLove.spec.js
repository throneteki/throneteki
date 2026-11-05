describe('The Things I Do For Love', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                inPlay: ['Cersei Lannister (Core)'],
                hand: ['The Things I Do For Love'],
                gold: 1
            },
            player2: { inPlay: ['Hot Pie (ToJ)'] }
        });
        this.player1.clickCard(this.theThingsIDoForLove);
        this.player1.clickCard(this.hotPie);
    });

    it("kneels your faction card to return a character with printed cost X or lower to its owner's hand", function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.hotPie.location).toBe('hand');
        expect(this.player1Object.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('The Things I Do For Love restrictions', function () {
    it('restricts targets to cost zero when X is zero', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['The Things I Do For Love'],
                inPlay: ['Cersei Lannister (Core)'],
                gold: 3
            },
            player2: { inPlay: ['Vale Refugee', 'Hedge Knight', 'The Roseroad'] }
        });
        this.player1.clickCard(this.theThingsIDoForLove);
        this.player1.selectValue('0');
        expect(this.player1).toBeAbleToSelect(this.valeRefugee);
        expect(this.player1).not.toBeAbleToSelect(this.hedgeKnight);
        expect(this.player1).not.toBeAbleToSelect(this.theRoseroad);
        expect(this.player1).not.toBeAbleToSelect(this.cerseiLannister);
        this.player1.clickCard(this.valeRefugee);
        expect(this.valeRefugee.location).toBe('hand');
        expect(this.hedgeKnight.location).toBe('play area');
        expect(this.player1Object.gold).toBe(3);
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });

    it('requires a Lannister Lord or Lady character', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['The Things I Do For Love'],
                inPlay: ['Lannisport Merchant'],
                gold: 3
            },
            player2: { inPlay: ['Hedge Knight'] }
        });
        expect(this.player1.actionUnavailableReason(this.theThingsIDoForLove)).toBe('condition');
        expect(this.player1Object.gold).toBe(3);
        expect(this.player1Object.faction.kneeled).toBe(false);
        expect(this.hedgeKnight.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('The Things I Do For Love with a cost reduction', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                inPlay: ['Cersei Lannister (Core)', 'Tourney Grounds'],
                hand: ['The Things I Do For Love'],
                gold: 5
            },
            player2: { inPlay: ['Robb Stark (Core)'] }
        });
        this.player1.clickCard(this.tourneyGrounds);
    });

    it('can choose a character whose cost is only affordable with the reduction', function () {
        this.player1.clickCard(this.theThingsIDoForLove);

        expect(this.player1).toBeAbleToSelect(this.robbStark);

        this.player1.clickCard(this.robbStark);

        expect(this.robbStark.location).toBe('hand');
        expect(this.player1Object.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
