describe('Hizdahr zo Loraq (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Hizdahr zo Loraq (R)'],
                hand: ['Khal Drogo (Core)', 'Burned Men'],
                gold: 3
            }
        });
        this.player1.clickCard(this.hizdahrZoLoraq);
        this.player1.clickCard(this.burnedMen);
    });

    it('discards a character from your hand to reduce the cost of the next card you marshal this phase by 3', function () {
        this.player1.clickCard(this.khalDrogo);

        expect(this.burnedMen.location).toBe('discard pile');
        expect(this.khalDrogo.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Hizdahr zo Loraq (R) when a duplicate is marshaled', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Hizdahr zo Loraq (R)', 'Khal Drogo (Core)'],
                hand: ['Khal Drogo (Core)', 'Burned Men', 'Hedge Knight'],
                gold: 3
            }
        });
        this.dupe = this.player1.findCardByName('Khal Drogo (Core)', 'hand');
        this.player1.clickCard(this.hizdahrZoLoraq);
        this.player1.clickCard(this.burnedMen);
        this.player1.clickCard(this.dupe);
    });

    it('uses up the reduction, as a duplicate is the next card you marshal', function () {
        expect(this.khalDrogo.dupes).toContain(this.dupe);

        this.player1.clickCard(this.hedgeKnight);

        expect(this.hedgeKnight.location).toBe('play area');
        expect(this.player1Object.gold).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
