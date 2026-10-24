describe('The Knight (KotI)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'greyjoy',
                inPlay: ['The Knight (KotI)', 'House Maester']
            }
        });
    });

    it('gains stealth and renown while attacking alone', function () {
        expect(this.theKnight.hasKeyword('stealth')).toBe(false);
        expect(this.theKnight.hasKeyword('renown')).toBe(false);

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.theKnight);
        this.player1.clickPrompt('Done');

        expect(this.theKnight.hasKeyword('stealth')).toBe(true);
        expect(this.theKnight.hasKeyword('renown')).toBe(true);
        expect(this.houseMaester.hasKeyword('renown')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });

    it('gains nothing while attacking with another character', function () {
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.theKnight);
        this.player1.clickCard(this.houseMaester);
        this.player1.clickPrompt('Done');

        expect(this.theKnight.hasKeyword('stealth')).toBe(false);
        expect(this.theKnight.hasKeyword('renown')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
