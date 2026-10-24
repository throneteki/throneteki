describe('Oathsworn Wildling', function () {
    function marshal(context, inPlay) {
        context.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'thenightswatch',
                gold: 1,
                hand: ['Oathsworn Wildling'],
                inPlay
            },
            player2: {
                inPlay: ['Wildling Bandit']
            }
        });

        context.player1.clickCard(context.oathswornWildling);
    }

    it('is sacrificed when you control no other Wildling character or Jon Snow', function () {
        marshal(this, []);

        expect(this.oathswornWildling.location).toBe('discard pile');
        expect(this.game.getPlainTextLog()).toContain(
            'player1 sacrifices Oathsworn Wildling as they control no other Wildling character or Jon Snow'
        );
        expect(this.player1).isReadyToTakeAction();
    });

    it('stays in play while you control another Wildling character', function () {
        marshal(this, ['Wildling Bandit']);

        expect(this.oathswornWildling.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });

    it('stays in play while you control Jon Snow', function () {
        marshal(this, ['Jon Snow (Core)']);

        expect(this.oathswornWildling.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });

    describe('when set up without another Wildling character or Jon Snow', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'setup',
                player1: {
                    faction: 'thenightswatch',
                    hand: ['Oathsworn Wildling']
                }
            });

            this.player1.clickCard(this.oathswornWildling);
            this.completeSetup();
        });

        it('is sacrificed once setup is finished', function () {
            expect(this.oathswornWildling.location).toBe('discard pile');
            expect(this.player1).toHavePrompt('Select a plot');
            expect(this.player1).isReadyToTakeAction();
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('when your last other Wildling leaves play', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: {
                    faction: 'thenightswatch',
                    inPlay: ['Oathsworn Wildling', 'Wildling Bandit']
                },
                player2: {
                    inPlay: ['Tumblestone Knight']
                }
            });

            this.unopposedChallenge(this.player2, 'Military', this.tumblestoneKnight);
            this.player1.clickCard(this.wildlingBandit);
        });

        it('is sacrificed', function () {
            expect(this.wildlingBandit.location).toBe('dead pile');
            expect(this.oathswornWildling.location).toBe('discard pile');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
