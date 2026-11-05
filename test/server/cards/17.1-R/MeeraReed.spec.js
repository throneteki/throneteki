describe('Meera Reed (R)', function () {
    describe('when a Winter plot card is revealed', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: {
                    faction: 'stark',
                    inPlay: ['Meera Reed (R)']
                },
                player2: {
                    plot: 'The Winds of Winter'
                }
            });

            this.player1.selectPlot('Filler Plot');
            this.player2.selectPlot('The Winds of Winter');
            this.selectFirstPlayer(this.player2);
        });

        it('returns her to shadows', function () {
            expect(this.meeraReed.location).toBe('shadows');
            expect(this.game.getPlainTextLog()).toContain(
                'player1 is forced to return Meera Reed to shadows'
            );
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('when no Winter plot card is revealed', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: {
                    faction: 'stark',
                    inPlay: ['Meera Reed (R)']
                }
            });

            this.player1.selectPlot('Filler Plot');
            this.player2.selectPlot('Filler Plot');
            this.selectFirstPlayer(this.player1);
        });

        it('stays in play', function () {
            expect(this.meeraReed.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when she comes out of shadows', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'stark',
                    gold: 2,
                    shadows: ['Meera Reed (R)']
                },
                player2: {
                    inPlay: ['Direwolf Pup', 'Grey Wind (Core)']
                }
            });

            this.player1.clickCard(this.meeraReed);
        });

        it('treats a chosen character as if its printed text box were blank until the end of the phase', function () {
            this.player1.triggerAbility(this.meeraReed);
            this.player1.clickCard(this.direwolfPup);

            expect(this.direwolfPup.isBlankExcludingTraits()).toBe(true);
            expect(this.direwolfPup.hasTrait('Direwolf')).toBe(true);
            expect(this.direwolfPup.getStrength()).toBe(1);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 uses Meera Reed to treat the text box of Direwolf Pup as blank until the end of the phase'
            );

            this.completeMarshalPhase();

            expect(this.direwolfPup.isBlankExcludingTraits()).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
