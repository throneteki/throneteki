describe('Bearskin Cloak', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [
                    { card: 'Bear Island Scout (R)', attachments: ['Bearskin Cloak'] },
                    { card: 'Tumblestone Knight', attachments: ['Bearskin Cloak'] }
                ]
            }
        });
    });

    it('gives the attached character +1 STR, and stealth if it has the House Mormont trait', function () {
        expect(this.tumblestoneKnight.getStrength()).toBe(3);
        expect(this.tumblestoneKnight.hasKeyword('Stealth')).toBe(false);
        expect(this.bearIslandScout.hasKeyword('Stealth')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
