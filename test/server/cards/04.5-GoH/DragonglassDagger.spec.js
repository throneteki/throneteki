describe('Dragonglass Dagger', function () {
    describe('when marshaled', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'thenightswatch',
                    hand: ['Dragonglass Dagger'],
                    inPlay: ['Ranging Party', 'Hedge Knight']
                }
            });

            this.player1.clickCard(this.dragonglassDagger);
        });

        it('can only be attached to a [thenightswatch] character', function () {
            expect(this.player1).toBeAbleToSelect(this.rangingParty);
            expect(this.player1).not.toBeAbleToSelect(this.hedgeKnight);

            this.player1.clickCard(this.rangingParty);

            expect(this.rangingParty.attachments).toContain(this.dragonglassDagger);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while attached', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'thenightswatch',
                    inPlay: [
                        { card: 'Ranging Party', attachments: ['Dragonglass Dagger'] },
                        { card: 'Samwell Tarly (Core)', kneeling: true }
                    ]
                },
                player2: {
                    gold: 2,
                    inPlay: ['Magister Illyrio (Core)']
                }
            });
        });

        it('gives no STR while the character is not participating', function () {
            expect(this.rangingParty.getStrength()).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        describe('while the character is participating in a challenge', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.rangingParty);
                this.player1.clickPrompt('Done');
                this.player1.clickPrompt('Pass');
                this.player2.clickMenu(this.magisterIllyrio, 'Stand a character');
            });

            it("gives it +2 STR and makes it immune to opponents' character abilities", function () {
                expect(this.rangingParty.getStrength()).toBe(7);
                expect(this.player2).not.toBeAbleToSelect(this.rangingParty);
                expect(this.player2).toBeAbleToSelect(this.samwellTarly);

                this.player2.clickCard(this.samwellTarly);

                expect(this.samwellTarly.kneeled).toBe(false);
                expect(this.player1).toHavePrompt('Initiate an action');
            });
        });
    });
});
