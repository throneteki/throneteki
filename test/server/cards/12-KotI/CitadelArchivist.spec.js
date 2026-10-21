describe('Citadel Archivist (KotI)', function () {
    describe('when it is discarded from your hand', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: {
                    hand: ['Citadel Archivist'],
                    discard: ['Hedge Knight']
                },
                player2: {
                    inPlay: ['House Maester'],
                    discard: ['Winterfell Steward']
                }
            });

            this.unopposedChallenge(this.player2, 'Intrigue', this.houseMaester);
        });

        it("shuffles each player's discard pile into their deck", function () {
            this.player1.triggerAbility(this.citadelArchivist);

            expect(this.citadelArchivist.location).toBe('draw deck');
            expect(this.hedgeKnight.location).toBe('draw deck');
            expect(this.winterfellSteward.location).toBe('draw deck');
            expect(this.player1Object.discardPile).toHaveLength(0);
            expect(this.player2Object.discardPile).toHaveLength(0);
            expect(this.game.getPlainTextLog()).toContain(
                "player1 uses Citadel Archivist to shuffle each player's discard pile into their deck"
            );
            expect(this.player2).isReadyToTakeAction();
        });

        it('can be declined', function () {
            this.player1.clickPrompt('Pass');

            expect(this.citadelArchivist.location).toBe('discard pile');
            expect(this.hedgeKnight.location).toBe('discard pile');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('when it is discarded from your deck by pillage', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    drawDeck: ['Citadel Archivist']
                },
                player2: {
                    faction: 'greyjoy',
                    inPlay: ['Orkmont Reaver', 'Corpse Lake']
                }
            });

            this.player1.clickPrompt('Done');
            this.unopposedChallenge(this.player2, 'Military', this.orkmontReaver);
            this.player1.triggerAbility(this.citadelArchivist);
        });

        it('still lets reactions to the discard trigger', function () {
            expect(this.citadelArchivist.location).toBe('draw deck');
            expect(this.player2).toAllowAbilityTrigger(this.corpseLake);
        });
    });

    describe('when it is placed in your dead pile instead', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: {
                    hand: ['Citadel Archivist']
                },
                player2: {
                    plot: 'Heads on Spikes'
                }
            });

            this.player1.selectPlot('Filler Plot');
            this.player2.selectPlot('Heads on Spikes');
            this.selectFirstPlayer(this.player1);
        });

        it('cannot be triggered', function () {
            expect(this.citadelArchivist.location).toBe('dead pile');
            expect(this.player1).not.toAllowAbilityTrigger(this.citadelArchivist);
        });
    });
});
