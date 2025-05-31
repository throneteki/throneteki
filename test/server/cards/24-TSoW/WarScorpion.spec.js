describe("War Scorpion", function () {
    integration(function () {
        beforeEach(function () {
            const arrynDeck = this.buildDeck('Stark', [
                'A Noble Cause',
                'Knights of the Vale',
                'The Eyrie (CoW)'
            ]);
            const martellDeck = this.buildDeck('Martell', [
                'A Noble Cause',
                'Scorpion Knight',
                'War Scorpion'
            ]);

            this.player1.selectDeck(arrynDeck);
            this.player2.selectDeck(martellDeck);

            this.startGame();
            this.keepStartingHands();

            this.army = this.player1.findCardByName('Knights of the Vale', 'hand');
            this.eyrie = this.player1.findCardByName('The Eyrie (CoW)', 'hand');

            this.martellChar = this.player2.findCardByName('Scorpion Knight', 'hand');
            this.scorpion = this.player2.findCardByName('War Scorpion', 'hand');

            this.player1.clickCard(this.army);
            this.player2.clickCard(this.martellChar);
            this.player2.clickCard(this.scorpion);

            this.completeSetup();

            this.player2.clickCard(this.scorpion);
            this.player2.clickCard(this.martellChar);

            this.selectFirstPlayer(this.player1);
        });

        it('should not present the option to kill an otherwise valid target that cannot be killed', function () {
            this.player1.clickCard(this.eyrie);
            this.completeMarshalPhase();
            this.player1.triggerAbility(this.eyrie);
            this.player1.clickCard(this.army);
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.army);
            this.player1.clickPrompt('Done');
            expect(this.army.inChallenge).toBe(true);
            this.player1.clickPrompt('Done');
            this.player2.clickMenu('War Scorpion', 'Remove attacker from challenge');
            this.player2.clickCard(this.army);
            expect(this.army.inChallenge).toBe(false);
        });
    });
});
