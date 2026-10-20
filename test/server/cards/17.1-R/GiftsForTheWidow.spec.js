describe('Gifts for the Widow (R)', function () {
    describe('when played', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'targaryen',
                    gold: 2,
                    hand: ['Gifts for the Widow (R)'],
                    inPlay: ['House Maester'],
                    drawDeck: ['Noble Lineage', "Syrio's Training", 'Valyrian Steel Dagger (LoCR)']
                },
                player2: {
                    inPlay: ['Bastard in Hiding']
                }
            });

            this.player1.clickCard(this.giftsForTheWidow);
            this.player1.selectValue('1');
        });

        it('kneels your faction card to search for an attachment with printed cost X or lower', function () {
            expect(this.player1Object.faction.kneeled).toBe(true);
            expect(this.player1Object.gold).toBe(1);
            expect(this.player1).toBeAbleToSelect(this.nobleLineage);
            expect(this.player1).toBeAbleToSelect(this.syriosTraining);
            expect(this.player1).not.toBeAbleToSelect(this.valyrianSteelDagger);
        });

        it('puts it into play attached to a character you control', function () {
            this.player1.clickCard(this.syriosTraining);

            expect(this.player1).toBeAbleToSelect(this.houseMaester);
            expect(this.player1).not.toBeAbleToSelect(this.bastardInHiding);

            this.player1.clickCard(this.houseMaester);

            expect(this.houseMaester.attachments).toContain(this.syriosTraining);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 plays Gifts for the Widow and kneels their faction card to search their deck for an attachment with printed cost 1 or lower'
            );
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while your faction card is kneeling', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'targaryen',
                    factionKneeling: true,
                    gold: 2,
                    hand: ['Gifts for the Widow (R)'],
                    inPlay: ['House Maester'],
                    drawDeck: ['Noble Lineage']
                }
            });
        });

        it('cannot be played', function () {
            expect(this.player1.actionUnavailableReason(this.giftsForTheWidow)).toBe('cost');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('with no gold', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'targaryen',
                    gold: 0,
                    hand: ['Gifts for the Widow (R)'],
                    inPlay: ['House Maester'],
                    drawDeck: ['Noble Lineage']
                }
            });

            this.player1.clickCard(this.giftsForTheWidow);
        });

        it('can be played for X = 0', function () {
            this.player1.clickCard(this.nobleLineage);
            this.player1.clickCard(this.houseMaester);

            expect(this.houseMaester.attachments).toContain(this.nobleLineage);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
