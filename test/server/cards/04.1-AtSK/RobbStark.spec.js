describe('Robb Stark (AtSK)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Robb Stark (AtSK)', 'Bear Island Scout (R)', 'Tumblestone Knight']
            },
            player2: {
                inPlay: ['Robert Baratheon (LMHR)', 'Bastard in Hiding', 'Ranging Party']
            }
        });
    });

    it('does not get STR outside [military] challenges', function () {
        expect(this.robbStark.getStrength()).toBe(5);
    });

    describe('during a [military] challenge in which he is participating', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.robbStark);
            this.player1.clickCard(this.bearIslandScout);
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.clickCard(this.robertBaratheon);
            this.player2.clickCard(this.bastardInHiding);
            this.player2.clickPrompt('Done');
        });

        it('gets +1 STR for each loyal character you control', function () {
            expect(this.robbStark.getStrength()).toBe(7);
            expect(this.robertBaratheon.getStrength()).toBe(5);
        });

        describe('when his action is used', function () {
            beforeEach(function () {
                this.player1.clickMenu(
                    this.robbStark,
                    'Stand and remove a character from the challenge'
                );
            });

            it('can only choose a participating non-King character', function () {
                expect(this.player1).toBeAbleToSelect(this.bastardInHiding);
                expect(this.player1).toBeAbleToSelect(this.bearIslandScout);
                expect(this.player1).not.toBeAbleToSelect(this.robertBaratheon);
                expect(this.player1).not.toBeAbleToSelect(this.robbStark);
                expect(this.player1).not.toBeAbleToSelect(this.rangingParty);
                expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);
            });

            it('stands the character and removes it from the challenge', function () {
                this.player1.clickCard(this.bastardInHiding);

                expect(this.bastardInHiding.kneeled).toBe(false);
                expect(this.bastardInHiding.isParticipating()).toBe(false);
                expect(this.robertBaratheon.kneeled).toBe(true);
                expect(this.robertBaratheon.isParticipating()).toBe(true);
                expect(this.game.getPlainTextLog()).toContain(
                    'player1 uses Robb Stark to stand Bastard in Hiding and remove them from the challenge'
                );
                expect(this.player2).toHavePrompt('Initiate an action');
            });

            it('cannot be used again in the same challenge', function () {
                this.player1.clickCard(this.bearIslandScout);
                this.player2.clickPrompt('Pass');

                expect(this.player1.actionUnavailableReason(this.robbStark)).toBe('limit');
                expect(this.player1).toHavePrompt('Initiate an action');
            });
        });
    });

    describe('during a [military] challenge in which he is not participating', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.bearIslandScout);
            this.player1.clickPrompt('Done');
        });

        it('cannot be used', function () {
            expect(this.robbStark.getStrength()).toBe(7);
            expect(this.player1.actionUnavailableReason(this.robbStark)).toBe('condition');
            expect(this.player1).toHavePrompt('Initiate an action');
        });
    });

    describe('during a [power] challenge', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.robbStark);
            this.player1.clickPrompt('Done');
        });

        it('cannot be used and gets no STR', function () {
            expect(this.robbStark.getStrength()).toBe(5);
            expect(this.player1.actionUnavailableReason(this.robbStark)).toBe('condition');
            expect(this.player1).toHavePrompt('Initiate an action');
        });
    });
});
