describe('Bronn (CoW)', function () {
    describe('Marshaling Action', function () {
        beforeEach(function () {
            this.setupTest({
                firstPlayer: 'player2',
                player1: { faction: 'lannister', gold: 1, inPlay: ['Bronn (CoW)'] },
                player2: { faction: 'lannister', gold: 1 }
            });
        });

        it('lets an opponent pay 1 gold to take control of Bronn', function () {
            this.player2.clickMenu(this.bronn, 'Take control of Bronn');

            expect(this.bronn).toBeControlledBy(this.player2);
            expect(this.player2Object.gold).toBe(0);
            expect(this.player1Object.cardsInPlay).not.toContain(this.bronn);
            expect(this.player2Object.cardsInPlay).toContain(this.bronn);
            expect(this.game.getPlainTextLog()).toContain(
                'player2 pays 1 gold to take control of Bronn'
            );
            expect(this.player2).isReadyToTakeAction();
        });

        it('cannot be used by the player who already controls Bronn', function () {
            this.player2.clickPrompt('Done');

            expect(this.player1.actionUnavailableReason(this.bronn)).toBe('noEffect');
            expect(this.player1).toHavePrompt('Marshal your cards');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('without 1 gold', function () {
        beforeEach(function () {
            this.setupTest({
                firstPlayer: 'player2',
                player1: { faction: 'lannister', inPlay: ['Bronn (CoW)'] },
                player2: { faction: 'lannister', gold: 0 }
            });
        });

        it('cannot be used', function () {
            expect(this.player2.actionUnavailableReason(this.bronn)).toBe('cost');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('outside the marshaling phase', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { faction: 'lannister', inPlay: ['Bronn (CoW)'] },
                player2: { faction: 'lannister' }
            });
        });

        it('cannot be used', function () {
            expect(this.player2.actionUnavailableReason(this.bronn)).toBe('phase');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('during a challenge', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { faction: 'lannister', inPlay: ['Bronn (CoW)', 'House Maester'] },
                player2: { faction: 'lannister', inPlay: ['Courtesan of the Rose'] }
            });
        });

        it('has only his printed icon outside a challenge', function () {
            expect(this.bronn.hasIcon('military')).toBe(true);
            expect(this.bronn.hasIcon('intrigue')).toBe(false);
            expect(this.bronn.hasIcon('power')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('gains a [military], an [intrigue] and a [power] icon when you are the defending player', function () {
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Intrigue');
            this.player2.clickCard(this.courtesanOfTheRose);
            this.player2.clickPrompt('Done');
            this.skipActionWindow();

            expect(this.bronn.hasIcon('military')).toBe(true);
            expect(this.bronn.hasIcon('intrigue')).toBe(true);
            expect(this.bronn.hasIcon('power')).toBe(true);
            expect(this.courtesanOfTheRose.hasIcon('military')).toBe(false);

            this.player1.clickCard(this.bronn);
            this.player1.clickPrompt('Done');

            expect(this.game.currentChallenge.defenders).toEqual([this.bronn]);
            expect(this.player1).toHavePrompt('Initiate an action');
        });

        it('does not gain icons when you are the attacking player', function () {
            this.player1.clickPrompt('Intrigue');
            this.player1.clickCard(this.houseMaester);
            this.player1.clickPrompt('Done');

            expect(this.bronn.hasIcon('intrigue')).toBe(false);
            expect(this.bronn.hasIcon('power')).toBe(false);
            expect(this.player1).toHavePrompt('Initiate an action');
        });
    });
});
