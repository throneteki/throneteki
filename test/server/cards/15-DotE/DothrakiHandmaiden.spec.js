describe('Dothraki Handmaiden', function () {
    function setup(inPlay) {
        this.setupTest({
            player1: {
                faction: 'targaryen',
                inPlay,
                hand: ['Noble Lineage', 'Hedge Knight'],
                gold: 5
            }
        });
        this.player1.clickMenu(this.dothrakiHandmaiden, 'Attach facedown attachment');
    }

    it('reveals an attachment from your hand and attaches it facedown', function () {
        setup.call(this, ['Dothraki Handmaiden']);
        expect(this.player1).not.toBeAbleToSelect(this.hedgeKnight);
        this.player1.clickCard(this.nobleLineage);
        expect(this.nobleLineage.parent).toBe(this.dothrakiHandmaiden);
        expect(this.nobleLineage.facedown).toBe(true);
        expect(this.dothrakiHandmaiden.hasIcon('power')).toBe(true);
    });

    it('lets you marshal its facedown cards while you control Daenerys Targaryen', function () {
        setup.call(this, ['Dothraki Handmaiden', 'Daenerys Targaryen (Core)']);
        this.player1.clickCard(this.nobleLineage);
        this.player1.clickCard(this.nobleLineage);
        this.player1.clickCard(this.daenerysTargaryen);
        expect(this.nobleLineage.facedown).toBe(false);
        expect(this.nobleLineage.parent).toBe(this.daenerysTargaryen);
    });
});
