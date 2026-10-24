describe('The Iron Throne (LMHR)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                inPlay: ['The Iron Throne (LMHR)'],
                hand: ['Tumblestone Knight']
            },
            player2: {
                hand: ['Tithe'],
                shadows: ['House Umber Berserkers'],
                inPlay: ['House Maester']
            }
        });

        this.player1.clickPrompt('Pass');
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickPrompt('Pass');
    });

    it('can be triggered after a phase begins', function () {
        expect(this.player1).toAllowAbilityTrigger(this.theIronThrone);
        expect(this.player2).not.toAllowAbilityTrigger(this.theIronThrone);

        this.player1.clickPrompt('Pass');

        expect(this.theIronThrone.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });

    describe('when a card is named', function () {
        beforeEach(function () {
            this.player1.triggerAbility(this.theIronThrone);
        });

        it('kneels The Iron Throne', function () {
            this.player1.nameCard('Tithe');

            expect(this.theIronThrone.kneeled).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('stops that card being marshaled', function () {
            this.player1.nameCard('Tumblestone Knight');
            this.player1.clickCard(this.tumblestoneKnight);

            expect(this.tumblestoneKnight.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });

        it('stops that card being played', function () {
            this.player1.nameCard('Tithe');
            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.tithe);

            expect(this.tithe.location).toBe('hand');
            expect(this.houseMaester.kneeled).toBe(false);
            expect(this.player2).isReadyToTakeAction();
        });

        it('stops that card being put into play', function () {
            this.player1.nameCard('House Umber Berserkers');
            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.houseUmberBerserkers);

            expect(this.houseUmberBerserkers.location).toBe('shadows');
            expect(this.player2).isReadyToTakeAction();
        });

        it('lasts until the end of the phase', function () {
            this.player1.nameCard('Tithe');
            this.completeMarshalPhase();

            expect(this.player2Object.canPlay(this.tithe)).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while The Iron Throne is kneeling', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: {
                    inPlay: [{ card: 'The Iron Throne (LMHR)', kneeling: true }]
                }
            });

            this.player1.clickPrompt('Pass');
            this.player1.selectPlot('Filler Plot');
            this.player2.selectPlot('Filler Plot');
            this.selectFirstPlayer(this.player1);
        });

        it('cannot be triggered', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.theIronThrone);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
