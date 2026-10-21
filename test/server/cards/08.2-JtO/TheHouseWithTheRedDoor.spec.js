describe('The House With the Red Door', function () {
    describe('after all agendas are announced', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'setup',
                player1: {
                    agenda: 'The House With the Red Door',
                    deck: [
                        'The Crag (TSoW)',
                        'Northern Armory',
                        'Winterfell Castle (BtB)',
                        'Gates of the Moon'
                    ]
                },
                beforeMulligan() {
                    expect(this.player2).toHavePrompt(
                        'Waiting for opponent to use The House With the Red Door'
                    );
                    expect(this.player1).toBeAbleToSelect(this.theCrag);
                    expect(this.player1).not.toBeAbleToSelect(this.northernArmory);
                    expect(this.player1).not.toBeAbleToSelect(this.winterfellCastle);
                    expect(this.player1).not.toBeAbleToSelect(this.gatesOfTheMoon);

                    this.player1.clickCard(this.theCrag);
                }
            });
        });

        it('puts a non-limited unique location with printed cost 3 or lower from your deck into play', function () {
            expect(this.theCrag.location).toBe('play area');
            expect(this.theCrag.facedown).toBe(false);
            expect(this.northernArmory.location).toBe('draw deck');
            expect(this.game.getPlainTextLog()).toContain(
                'player1 uses The House With the Red Door to search their deck for a non-limited unique location with printed cost 3 or lower'
            );
            expect(this.game.getPlainTextLog()).toContain('player1 puts The Crag into play');
            expect(this.game.getPlainTextLog()).toContain('player1 shuffles their deck');
        });

        it('keeps the location in play through setup and does not count it as a setup card', function () {
            this.completeSetup();

            expect(this.theCrag.location).toBe('play area');
            expect(this.game.getPlainTextLog()).toContain('player1 does not set up any cards');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('during setup', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'setup',
                player1: {
                    agenda: 'The House With the Red Door',
                    deck: ['The Crag (TSoW)']
                },
                beforeMulligan() {
                    this.player1.clickCard(this.theCrag);
                }
            });
        });

        it('lets you spend no more than 4 gold', function () {
            expect(this.player1Object.gold).toBe(4);
            expect(this.player2Object.gold).toBe(8);

            this.completeSetup();

            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when an opponent tries to discard the location from play with a card effect', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: {
                    agenda: 'The House With the Red Door',
                    deck: ['The Crag (TSoW)'],
                    inPlay: ['Heart Tree Grove']
                },
                player2: {
                    hand: ['Put to the Torch'],
                    inPlay: ['Hedge Knight', 'Tumblestone Knight', 'Bastard in Hiding']
                },
                beforeMulligan() {
                    this.player1.clickCard(this.theCrag);
                }
            });

            this.player2.clickPrompt('Military');
            this.player2.clickCard(this.hedgeKnight);
            this.player2.clickCard(this.tumblestoneKnight);
            this.player2.clickCard(this.bastardInHiding);
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.triggerAbility(this.putToTheTorch);
        });

        it('cannot be chosen', function () {
            expect(this.player2).not.toBeAbleToSelect(this.theCrag);
            expect(this.player2).toBeAbleToSelect(this.heartTreeGrove);

            this.player2.clickCard(this.heartTreeGrove);

            expect(this.heartTreeGrove.location).toBe('discard pile');
            expect(this.theCrag.location).toBe('play area');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
