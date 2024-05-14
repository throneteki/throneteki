describe('playing events', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('baratheon', [
                'Trading with the Pentoshi',
                'Melisandre (Core)',
                'Seen In Flames',
                'Theon Greyjoy (Core)',
                'Risen from the Sea'
            ]);
            const deck2 = this.buildDeck('martell', [
                'Trading with the Pentoshi',
                "The Hand's Judgment",
                "The Hand's Judgment",
                'Hedge Knight',
                'Tower of the Sun',
                "The Prince's Plan"
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.knight = this.player2.findCardByName('Hedge Knight', 'hand');
            this.plan = this.player2.findCardByName("The Prince's Plan", 'hand');
            this.event = this.player2.findCardByName("The Hand's Judgment", 'hand');

            this.player1.clickCard('Melisandre', 'hand');
            this.player2.clickCard(this.knight);
            this.player2.clickCard('Tower of the Sun', 'hand');

            this.completeSetup();

            this.selectFirstPlayer(this.player1);
            this.selectPlotOrder(this.player1);

            this.completeMarshalPhase();
        });

        describe('when playing an Action event', function () {
            beforeEach(function () {
                this.player1.clickCard('Seen In Flames');
                this.player2.clickPrompt('Pass');

                // Discard Hand's Judgment from the opponent's hand
                this.player1.clickCard(this.event);
            });

            it('should count as having played the event', function () {
                expect(this.player1).toAllowAbilityTrigger('Melisandre');

                this.player1.triggerAbility('Melisandre');
                this.player1.clickCard(this.knight);

                expect(this.knight.kneeled).toBe(true);
            });
        });

        describe('when cancelling the effects of an event', function () {
            beforeEach(function () {
                this.player1.clickCard('Seen In Flames');
                this.player2.triggerAbility("The Hand's Judgment");

                // Pass on Tower of the Sun
                this.player2.clickPrompt('Pass');
            });

            it('should not prompt to cancel the event again', function () {
                // The second copy of Hand's Judgment should not prompt for the
                // already cancelled event.
                expect(this.player2).not.toAllowAbilityTrigger("The Hand's Judgment");
            });

            it('should still count as having played the event', function () {
                expect(this.player1).toAllowAbilityTrigger('Melisandre');

                this.player1.triggerAbility('Melisandre');
                this.player1.clickCard(this.knight);

                expect(this.knight.kneeled).toBe(true);
            });
        });

        describe('when a return-from-discard event ability triggers', function () {
            beforeEach(function () {
                this.player2.dragCard(this.plan, 'discard pile');

                this.player1.clickPrompt('Power');
                this.player1.clickCard('Melisandre', 'play area');
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.triggerAbility("The Prince's Plan");
            });

            it('should not count as playing an event', function () {
                expect(this.player2).not.toAllowAbilityTrigger('Tower of the Sun');
            });
        });

        describe('when an event becomes an attachment', function () {
            beforeEach(function () {
                let character = this.player1.findCardByName('Theon Greyjoy', 'hand');
                this.player1.dragCard(character, 'play area');

                this.game.killCharacter(character, { allowSave: true });
                this.game.continue();

                this.player1.triggerAbility('Risen from the Sea');
                this.player1.clickCard(character);

                // Pass on Hand's Judgment to allow the save
                this.player2.clickPrompt('Pass');
            });

            it('should count as playing an event', function () {
                expect(this.player2).toAllowAbilityTrigger('Tower of the Sun');
            });
        });
    });
});
