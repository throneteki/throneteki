describe('Jousting Pavilion', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'tyrell',
                inPlay: [
                    'Jousting Pavilion',
                    'Tumblestone Knight',
                    'House Dayne Knight',
                    'House Maester'
                ]
            },
            player2: {
                inPlay: ['Hedge Knight']
            }
        });
    });

    it('gives a Knight you control +1 STR while it is attacking alone', function () {
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');

        expect(this.tumblestoneKnight.getStrength()).toBe(3);
        expect(this.houseDayneKnight.getStrength()).toBe(2);
        expect(this.hedgeKnight.getStrength()).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });

    it('gives no STR while the Knight is not attacking alone', function () {
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickCard(this.houseDayneKnight);
        this.player1.clickPrompt('Done');

        expect(this.tumblestoneKnight.getStrength()).toBe(2);
        expect(this.houseDayneKnight.getStrength()).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });

    it('gives a Knight you control +1 STR while it is defending alone', function () {
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.houseDayneKnight);
        this.player1.clickPrompt('Done');

        expect(this.houseDayneKnight.getStrength()).toBe(3);
        expect(this.hedgeKnight.getStrength()).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
