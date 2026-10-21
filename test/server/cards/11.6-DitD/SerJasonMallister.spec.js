describe('Ser Jason Mallister', function () {
    describe('while there are no cards in shadows', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'stark',
                    inPlay: ['Ser Jason Mallister']
                }
            });
        });

        it('gains renown', function () {
            expect(this.serJasonMallister.hasKeyword('Renown')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while there is a card in shadows', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'stark',
                    inPlay: ['Ser Jason Mallister', 'Tumblestone Knight']
                },
                player2: {
                    shadows: ['Meera Reed (R)']
                }
            });
        });

        it('does not gain renown', function () {
            expect(this.serJasonMallister.hasKeyword('Renown')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('discards a card in shadows controlled by the losing opponent after you win a challenge in which he is attacking', function () {
            this.unopposedChallenge(this.player1, 'Power', this.serJasonMallister);
            this.player1.triggerAbility(this.serJasonMallister);

            expect(this.player1).toBeAbleToSelect(this.meeraReed);

            this.player1.clickCard(this.meeraReed);

            expect(this.meeraReed.location).toBe('discard pile');
            expect(this.game.getPlainTextLog()).toContain(
                'player1 uses Ser Jason Mallister to discard Meera Reed from shadows'
            );
            expect(this.serJasonMallister.hasKeyword('Renown')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('cannot be triggered when he is not attacking', function () {
            this.unopposedChallenge(this.player1, 'Power', this.tumblestoneKnight);

            expect(this.player1).not.toAllowAbilityTrigger(this.serJasonMallister);
            expect(this.meeraReed.location).toBe('shadows');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
