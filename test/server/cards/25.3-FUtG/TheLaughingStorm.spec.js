describe('The Laughing Storm (FUtG)', function () {
    function setup(context, phase, { kneeling = false, firstPlayer = 'player1' } = {}) {
        context.setupTest({
            phase,
            firstPlayer,
            player1: { plotDeck: ['Heads on Spikes'], inPlay: ['Cersei Lannister (LoCR)'] },
            player2: {
                inPlay: [
                    {
                        card: 'The Red Keep (Core)',
                        attachments: [{ card: 'The Laughing Storm (FUtG)', kneeling }]
                    },
                    'Bastard in Hiding'
                ],
                hand: ['Stannis Baratheon (Core)']
            }
        });
    }

    function revealHeadsOnSpikes(context) {
        context.player1.selectPlot('Heads on Spikes');
        context.player2.selectPlot('Filler Plot');
        context.selectFirstPlayer(context.player1);
    }

    describe('while it is standing', function () {
        it('stops Heads on Spikes discarding from your hand', function () {
            setup(this, 'plot');
            revealHeadsOnSpikes(this);

            expect(this.stannisBaratheon.location).toBe('hand');
            expect(this.player2Object.deadPile).toHaveLength(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('stops intrigue claim discarding from your hand', function () {
            setup(this, 'challenge');
            this.unopposedChallenge(this.player1, 'Intrigue', this.cerseiLannister);

            expect(this.stannisBaratheon.location).toBe('hand');
            expect(this.player2Object.discardPile).toHaveLength(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('kneels to kneel a character controlled by the losing opponent after you win a challenge', function () {
            setup(this, 'challenge', { firstPlayer: 'player2' });
            this.unopposedChallenge(this.player2, 'Power', this.bastardInHiding);
            this.player2.triggerAbility(this.theLaughingStorm);
            this.player2.clickCard(this.cerseiLannister);

            expect(this.cerseiLannister.kneeled).toBe(true);
            expect(this.theLaughingStorm.kneeled).toBe(true);
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('while it is kneeling', function () {
        it('lets Heads on Spikes discard from your hand', function () {
            setup(this, 'plot', { kneeling: true });
            revealHeadsOnSpikes(this);
            this.player1.clickPrompt('Pass');

            expect(this.stannisBaratheon.location).toBe('dead pile');
            expect(this.player1).isReadyToTakeAction();
        });

        it('lets intrigue claim discard from your hand', function () {
            setup(this, 'challenge', { kneeling: true });
            this.unopposedChallenge(this.player1, 'Intrigue', this.cerseiLannister);
            this.player1.clickPrompt('Pass');

            expect(this.player2Object.discardPile).toHaveLength(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
