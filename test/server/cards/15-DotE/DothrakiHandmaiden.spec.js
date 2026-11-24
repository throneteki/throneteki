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

    describe('with Valyrian Steel', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    faction: 'targaryen',
                    agenda: 'Valyrian Steel (LMHR)',
                    inPlay: ['Dothraki Handmaiden', 'Daenerys Targaryen (Core)'],
                    hand: ['Noble Lineage'],
                    gold: 5
                }
            });
            this.player1.clickMenu(this.dothrakiHandmaiden, 'Attach facedown attachment');
            this.player1.clickCard(this.nobleLineage);
        });

        it('triggers the agenda when the attachment is attached facedown', function () {
            expect(this.player1).toAllowAbilityTrigger('Valyrian Steel');
            this.player1.triggerAbility('Valyrian Steel');
            this.player1.clickPrompt('Gain 1 gold');
            expect(this.player1Object.gold).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not trigger the agenda when the facedown attachment is marshaled', function () {
            this.player1.clickPrompt('Pass');
            this.player1.clickCard(this.nobleLineage);
            this.player1.clickCard(this.daenerysTargaryen);
            expect(this.nobleLineage.parent).toBe(this.daenerysTargaryen);
            expect(this.player1).not.toAllowAbilityTrigger('Valyrian Steel');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
