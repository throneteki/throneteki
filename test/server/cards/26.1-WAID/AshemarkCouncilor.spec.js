describe('Ashemark Councilor (WAID)', function () {
    describe('after it enters play', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: ['Tumblestone Knight', 'Hedge Knight'],
                    hand: ['Ashemark Councilor (WAID)']
                }
            });
            this.player1.clickCard(this.ashemarkCouncilor);
            this.player1.triggerAbility(this.ashemarkCouncilor);
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickCard(this.hedgeKnight);
            this.player1.clickPrompt('Done');
        });

        it('has up to 3 cards without gold gain 1 gold, and gets STR equal to the number of cards with gold', function () {
            expect(this.tumblestoneKnight.gold).toBe(1);
            expect(this.hedgeKnight.gold).toBe(1);
            expect(this.ashemarkCouncilor.getStrength()).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});

describe('Ashemark Councilor (WAID) on cards in play outside the play area', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                agenda: 'Fealty',
                inPlay: [{ card: 'Ser Davos Seaworth (TTWDFL)', dupes: 1 }],
                hand: ['Ashemark Councilor (WAID)']
            }
        });
        this.plot = this.player1Object.activePlot;
        this.factionCard = this.player1Object.faction;
        this.dupe = this.serDavosSeaworth.dupes[0];
        this.fealty = this.player1Object.agenda;
        this.player1.clickCard(this.ashemarkCouncilor);
        this.player1.triggerAbility(this.ashemarkCouncilor);
    });

    it('can give gold to the revealed plot, the faction card and a duplicate, but not an agenda', function () {
        expect(this.player1).toBeAbleToSelect(this.plot);
        expect(this.player1).toBeAbleToSelect(this.factionCard);
        expect(this.player1).toBeAbleToSelect(this.dupe);
        expect(this.player1).toBeAbleToSelect(this.serDavosSeaworth);
        expect(this.player1).not.toBeAbleToSelect(this.fealty);

        this.player1.clickCard(this.plot);
        this.player1.clickCard(this.factionCard);
        this.player1.clickCard(this.dupe);
        this.player1.clickPrompt('Done');

        expect(this.plot.gold).toBe(1);
        expect(this.factionCard.gold).toBe(1);
        expect(this.dupe.gold).toBe(1);
        expect(this.serDavosSeaworth.gold).toBe(0);
        expect(this.ashemarkCouncilor.getStrength()).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });
});
