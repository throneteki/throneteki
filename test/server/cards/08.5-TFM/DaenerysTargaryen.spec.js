describe('Daenerys Targaryen (TFM)', function () {
    describe('when a constant effect would lower her STR', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: { plotDeck: ['Blood of the Dragon'], inPlay: ['Daenerys Targaryen (TFM)'] }
            });
            this.player1.selectPlot('Blood of the Dragon');
            this.player2.selectPlot('Filler Plot');
            this.selectFirstPlayer(this.player1);
        });

        it('does not lower it', function () {
            expect(this.daenerysTargaryen.getStrength()).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('after you play a targaryen event', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    plot: 'Trading with the Pentoshi',
                    inPlay: ['Daenerys Targaryen (TFM)', 'Winterfell Steward'],
                    hand: ['Waking the Dragon', 'Nightmares', 'A Dragon Is No Slave']
                }
            });
            this.player1.clickCard(this.wakingTheDragon);
            this.player1.clickCard(this.daenerysTargaryen);
            this.player1.triggerAbility(this.daenerysTargaryen);
        });

        it('gives a character -1 STR and kills it if its STR is 0', function () {
            this.player1.clickCard(this.winterfellSteward);

            expect(this.winterfellSteward.location).toBe('dead pile');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not reduce her own STR', function () {
            this.player1.clickCard(this.daenerysTargaryen);

            expect(this.daenerysTargaryen.getStrength()).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('applies to her once she is blanked, and kills her when her STR reaches 0', function () {
            this.player1.clickCard(this.daenerysTargaryen);
            this.player1.clickCard(this.nightmares);
            this.player1.clickCard(this.daenerysTargaryen);

            // The earlier lasting effect from her own ability now applies.
            expect(this.daenerysTargaryen.getStrength()).toBe(2);

            this.player1.clickCard(this.aDragonIsNoSlave);
            this.player1.clickCard(this.daenerysTargaryen);

            expect(this.daenerysTargaryen.location).toBe('dead pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('vs The Lord of the Crossing', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    agenda: 'The Lord of the Crossing',
                    inPlay: [
                        'Daenerys Targaryen (TFM)',
                        'Viserion (Core)',
                        'Viserys Targaryen (Core)'
                    ]
                }
            });
        });

        it('does not reduce her STR during the first challenge', function () {
            this.player1.clickPrompt('Intrigue');
            this.player1.clickCard(this.daenerysTargaryen);
            this.player1.clickPrompt('Done');

            expect(this.daenerysTargaryen.getStrength()).toBe(3);
        });

        it('increases her STR during the third challenge', function () {
            this.unopposedChallenge(this.player1, 'Military', this.viserion);
            this.unopposedChallenge(this.player1, 'Power', this.viserysTargaryen);
            this.player1.clickPrompt('Intrigue');
            this.player1.clickCard(this.daenerysTargaryen);
            this.player1.clickPrompt('Done');

            expect(this.daenerysTargaryen.getStrength()).toBe(5);
        });
    });

    // Ruling: http://www.cardgamedb.com/forums/index.php?/topic/39646-ruling-daenerys-targaryen-tfm-strangler/
    describe('vs Strangler', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: [{ card: 'Daenerys Targaryen (TFM)', attachments: ['Strangler'] }]
                }
            });
            this.player1.clickPrompt('Intrigue');
            this.player1.clickCard(this.daenerysTargaryen);
            this.player1.clickPrompt('Done');
        });

        it('does not set her STR to 1', function () {
            expect(this.daenerysTargaryen.getStrength()).toBe(3);
        });
    });
});
