describe('Gendry (BtB)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [
                    'Gendry (BtB)',
                    { card: 'Tumblestone Knight', attachments: ['Lady Forlorn'] }
                ]
            }
        });
        this.completeMarshalPhase();
        this.player1.triggerAbility(this.gendry);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('gains renown while you control no loyal characters, and gives a non-loyal character with a Weapon +2 STR and his keywords after the challenges phase begins', function () {
        expect(this.gendry.hasKeyword('renown')).toBe(true);
        expect(this.tumblestoneKnight.getStrength()).toBe(4);
        expect(this.tumblestoneKnight.hasKeyword('renown')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
