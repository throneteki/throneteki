describe('She-Bear', function () {
    describe('when you marshal her', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'stark',
                    gold: 3,
                    hand: [
                        'She-Bear',
                        'Tumblestone Knight',
                        'Ice (Core)',
                        'Greatjon Umber',
                        'House Maester'
                    ]
                }
            });

            this.player1.clickCard(this.sheBear);
        });

        it('puts a [stark] character or attachment with printed cost 3 or lower into play from your hand', function () {
            this.player1.triggerAbility(this.sheBear);

            expect(this.player1).toBeAbleToSelect(this.tumblestoneKnight);
            expect(this.player1).toBeAbleToSelect(this.ice);
            expect(this.player1).not.toBeAbleToSelect(this.greatjonUmber);
            expect(this.player1).not.toBeAbleToSelect(this.houseMaester);

            this.player1.clickCard(this.tumblestoneKnight);

            expect(this.tumblestoneKnight.location).toBe('play area');
            expect(this.player1Object.gold).toBe(0);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 uses She-Bear to put Tumblestone Knight into play'
            );
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when she is put into play without being marshaled', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'stark',
                    gold: 3,
                    hand: ['She-Bear', 'She-Bear']
                }
            });

            [this.first, this.second] = this.player1.filterCardsByName('She-Bear', 'hand');
            this.player1.clickCard(this.first);
            this.player1.triggerAbility(this.first);
            this.player1.clickCard(this.second);
        });

        it('does not trigger', function () {
            expect(this.second.location).toBe('play area');
            expect(this.player1).not.toAllowAbilityTrigger(this.second);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
