describe('Starry Septa', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'tyrell',
                inPlay: [
                    'Starry Septa',
                    { card: 'Tumblestone Knight', power: 1 },
                    'House Dayne Knight',
                    { card: 'Bastard in Hiding', power: 1 }
                ]
            },
            player2: {
                faction: 'greyjoy',
                inPlay: [{ card: "Black Wind's Crew", gold: 1 }, 'Palace Spearman']
            }
        });
    });

    it('cannot be used when no participating character has gold or power', function () {
        expect(this.player1.actionUnavailableReason(this.starrySepta)).toBe('target');
        expect(this.player1).isReadyToTakeAction();
    });

    describe('after attackers are declared', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickCard(this.houseDayneKnight);
            this.player1.clickPrompt('Done');

            this.player1.clickMenu(this.starrySepta, 'Stand and remove participating character');
        });

        it('can only choose a participating character with gold or power', function () {
            expect(this.player1).toBeAbleToSelect(this.tumblestoneKnight);
            expect(this.player1).not.toBeAbleToSelect(this.houseDayneKnight);
            expect(this.player1).not.toBeAbleToSelect(this.bastardInHiding);
            expect(this.player1).not.toBeAbleToSelect(this.starrySepta);
            expect(this.player1).not.toBeAbleToSelect(this.blackWindsCrew);
            expect(this.player1).not.toBeAbleToSelect(this.palaceSpearman);
            this.player1.clickCard(this.tumblestoneKnight);
            expect(this.player2).isReadyToTakeAction();
        });

        it('kneels Starry Septa to stand the character and remove it from the challenge', function () {
            this.player1.clickCard(this.tumblestoneKnight);

            expect(this.starrySepta.kneeled).toBe(true);
            expect(this.tumblestoneKnight.kneeled).toBe(false);
            expect(this.tumblestoneKnight.isParticipating()).toBe(false);
            expect(this.houseDayneKnight.kneeled).toBe(true);
            expect(this.houseDayneKnight.isAttacking()).toBe(true);
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('after a defender with gold is declared', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.houseDayneKnight);
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.clickCard(this.blackWindsCrew);
            this.player2.clickCard(this.palaceSpearman);
            this.player2.clickPrompt('Done');

            this.player1.clickMenu(this.starrySepta, 'Stand and remove participating character');
        });

        it('can choose it', function () {
            expect(this.player1).toBeAbleToSelect(this.blackWindsCrew);
            expect(this.player1).not.toBeAbleToSelect(this.palaceSpearman);
            expect(this.player1).not.toBeAbleToSelect(this.houseDayneKnight);
            this.player1.clickCard(this.blackWindsCrew);
            expect(this.player2).isReadyToTakeAction();
        });

        it('stands it and removes it from the challenge', function () {
            this.player1.clickCard(this.blackWindsCrew);

            expect(this.blackWindsCrew.kneeled).toBe(false);
            expect(this.blackWindsCrew.isParticipating()).toBe(false);
            expect(this.palaceSpearman.kneeled).toBe(true);
            expect(this.palaceSpearman.isDefending()).toBe(true);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
