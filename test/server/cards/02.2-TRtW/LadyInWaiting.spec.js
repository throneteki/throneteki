describe('Lady-in-Waiting', function () {
    describe('when there is no Lady character out', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { faction: 'tyrell', hand: ['Lady-in-Waiting'], gold: 5 }
            });
            this.player1.clickCard(this.ladyInWaiting);
        });

        it('marshals as normal for its normal cost', function () {
            expect(this.ladyInWaiting.location).toBe('play area');
            expect(this.player1Object.gold).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when there is a Lady character out', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'tyrell',
                    hand: ['Lady-in-Waiting'],
                    inPlay: ['Margaery Tyrell (Core)'],
                    gold: 4
                },
                player2: { faction: 'lannister', hand: ['Treachery'], gold: 3 }
            });
            this.player1.clickCard(this.ladyInWaiting);
        });

        it('prompts whether to marshal it as a duplicate', function () {
            expect(this.ladyInWaiting.location).toBe('hand');
            expect(this.player1).toHavePrompt('Play Lady-in-Waiting:');
        });

        describe('and the player marshals it as a duplicate', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Marshal as dupe');
                this.player1.clickCard(this.margaeryTyrell);
            });

            it('places it on the Lady as a duplicate at no cost', function () {
                expect(this.ladyInWaiting.location).toBe('duplicate');
                expect(this.margaeryTyrell.dupes).toEqual([this.ladyInWaiting]);
                expect(this.player1Object.gold).toBe(4);
                expect(this.player1).isReadyToTakeAction();
            });

            it('cannot be canceled', function () {
                expect(this.player2).not.toAllowAbilityTrigger('Treachery');
            });
        });
    });

    describe('when you cannot marshal characters', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'tyrell',
                    plot: 'Kingswood Ambush',
                    hand: ['Lady-in-Waiting'],
                    inPlay: ['Margaery Tyrell (Core)'],
                    gold: 4
                }
            });
            this.player1.clickCard(this.ladyInWaiting);
        });

        it('can still marshal it as a duplicate', function () {
            expect(this.player1).toBeAbleToSelect(this.margaeryTyrell);
            this.player1.clickCard(this.margaeryTyrell);

            expect(this.ladyInWaiting.location).toBe('duplicate');
            expect(this.margaeryTyrell.dupes).toContain(this.ladyInWaiting);
            expect(this.player1Object.gold).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
