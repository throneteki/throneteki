describe('Sentinels of the Realm', function () {
    describe('while you control no Guard characters', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    agenda: 'Sentinels of the Realm',
                    hand: ['Nightmares'],
                    inPlay: ['Tumblestone Knight']
                }
            });
        });

        it('stops you playing events', function () {
            this.player1.clickCard(this.nightmares);

            expect(this.nightmares.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while you control a Guard character', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    agenda: 'Sentinels of the Realm',
                    hand: ['Nightmares'],
                    inPlay: ['Trident Guard (WAID)', 'Tumblestone Knight']
                }
            });
        });

        it('lets you play events', function () {
            this.player1.clickCard(this.nightmares);
            this.player1.clickCard(this.tumblestoneKnight);

            expect(this.nightmares.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when the challenges phase ends', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    agenda: 'Sentinels of the Realm',
                    inPlay: ['Trident Guard (WAID)']
                },
                player2: {
                    inPlay: ['Bastard in Hiding', 'Tumblestone Knight']
                }
            });

            this.player1.clickPrompt('Done');
        });

        it('draws 3 cards when no challenge was initiated against you', function () {
            this.player2.clickPrompt('Done');
            this.player1.triggerAbility('Sentinels of the Realm');

            expect(this.player1Object.hand.length).toBe(3);
            expect(this.player2Object.hand).toEqual([]);
            expect(this.player1).toHavePrompt('Select a plot');
        });

        it('draws 1 card fewer for each challenge type initiated against you', function () {
            this.unopposedChallenge(this.player2, 'Power', this.bastardInHiding);
            this.player2.clickPrompt('Done');
            this.player1.triggerAbility('Sentinels of the Realm');

            expect(this.player1Object.hand.length).toBe(2);
            expect(this.player1).toHavePrompt('Select a plot');
        });

        it('draws 1 card when two challenge types were initiated against you', function () {
            this.unopposedChallenge(this.player2, 'Power', this.bastardInHiding);
            this.unopposedChallenge(this.player2, 'Military', this.tumblestoneKnight);
            this.player1.clickCard(this.tridentGuard);
            this.player2.clickPrompt('Done');
            this.player1.triggerAbility('Sentinels of the Realm');

            expect(this.player1Object.hand.length).toBe(1);
            expect(this.player1).toHavePrompt('Select a plot');
        });
    });
});
