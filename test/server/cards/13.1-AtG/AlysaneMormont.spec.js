describe('Alysane Mormont', function () {
    describe('while each character you control is [stark]', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Alysane Mormont', 'Tumblestone Knight']
                }
            });
        });

        it('has no stealth outside [military] challenges', function () {
            expect(this.alysaneMormont.hasKeyword('stealth')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('gains stealth and does not kneel when declared as an attacker in a [military] challenge', function () {
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.alysaneMormont);
            this.player1.clickPrompt('Done');

            expect(this.alysaneMormont.kneeled).toBe(false);
            expect(this.alysaneMormont.hasKeyword('stealth')).toBe(true);
            expect(this.tumblestoneKnight.hasKeyword('stealth')).toBe(false);
            expect(this.player1).toHavePrompt('Initiate an action');
        });

        it('kneels when declared as an attacker in a [power] challenge', function () {
            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.alysaneMormont);
            this.player1.clickPrompt('Done');

            expect(this.alysaneMormont.kneeled).toBe(true);
            expect(this.alysaneMormont.hasKeyword('stealth')).toBe(false);
            expect(this.player1).toHavePrompt('Initiate an action');
        });
    });

    describe('while you control a non-[stark] character', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Alysane Mormont', 'House Maester']
                }
            });

            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.alysaneMormont);
            this.player1.clickPrompt('Done');
        });

        it('kneels and gains no stealth', function () {
            expect(this.alysaneMormont.kneeled).toBe(true);
            expect(this.alysaneMormont.hasKeyword('stealth')).toBe(false);
            expect(this.player1).toHavePrompt('Initiate an action');
        });
    });
});
