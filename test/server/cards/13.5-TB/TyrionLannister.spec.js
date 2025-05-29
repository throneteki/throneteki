describe('Tyrion Lannister', function () {
    integration(function () {
        describe('when putting a non-Shadow card into shadows', function () {
            beforeEach(function () {
                const deck = this.buildDeck('lannister', [
                    'Fealty',
                    'Late Summer Feast',
                    'Hedge Knight',
                    'Tyrion Lannister (TB)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.tyrionLannister = this.player1.findCardByName('Tyrion Lannister', 'hand');
                this.characterToPutIntoShadows = this.player1.findCardByName(
                    'Hedge Knight',
                    'hand'
                );

                this.player1.clickCard(this.tyrionLannister);
                this.player1.clickPrompt('Setup in shadows');
                this.player1.clickCard(this.characterToPutIntoShadows);

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                //trigger tyrion
                this.player1.clickCard(this.tyrionLannister);
                this.player1.triggerAbility(this.tyrionLannister);
                this.player1.clickCard(this.characterToPutIntoShadows);

                // Attempt to bring the card out of shadows
                this.player1.clickCard(this.characterToPutIntoShadows);
            });

            it('allows the card to be brought out of shadows', function () {
                expect(this.characterToPutIntoShadows.location).toBe('play area');
            });

            it('costs the printed cost of the card', function () {
                // 9 gold from plot - 5 to bring tyrion out of shadows - 2 to bring hedge knight out of shadows for printed cost
                expect(this.player1Object.gold).toBe(2);
            });
        });

        describe('when putting limited cards into shadows', function () {
            beforeEach(function () {
                const deck = this.buildDeck('lannister', [
                    'Fealty',
                    'Late Summer Feast',
                    'Tyrion Lannister (TB)',
                    'The Roseroad',
                    'The Roseroad'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.tyrionLannister = this.player1.findCardByName('Tyrion Lannister', 'hand');
                [this.location1, this.location2] = this.player1.filterCardsByName(
                    'The Roseroad',
                    'hand'
                );

                this.player1.clickCard(this.tyrionLannister);
                this.player1.clickPrompt('Setup in shadows');
                this.player1.clickCard(this.location1);

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                // Marshal a limited card
                this.player1.clickCard(this.location2);

                //trigger tyrion
                this.player1.clickCard(this.tyrionLannister);
                this.player1.triggerAbility(this.tyrionLannister);
                this.player1.clickCard(this.location1);

                // Attempt to bring the card out of shadows
                this.player1.clickCard(this.location1);
            });

            it('allows the limited card to be brought out of shadows, bypassing the limit', function () {
                expect(this.location1.location).toBe('play area');
            });
        });

        describe('when putting a Shadow card into shadows with a higher printed cost than the printed shadow cost', function () {
            beforeEach(function () {
                const deck = this.buildDeck('lannister', [
                    'Fealty',
                    'Late Summer Feast',
                    'Penny',
                    'Tyrion Lannister (TB)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.tyrionLannister = this.player1.findCardByName('Tyrion Lannister', 'hand');
                this.penny = this.player1.findCardByName('Penny', 'hand');

                this.player1.clickCard(this.tyrionLannister);
                this.player1.clickPrompt('Setup in shadows');
                this.player1.clickCard(this.penny);
                this.player1.clickPrompt('Setup');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                //trigger tyrion
                this.player1.clickCard(this.tyrionLannister);
                this.player1.triggerAbility(this.tyrionLannister);
                this.player1.clickCard(this.penny);

                // Attempt to bring the card out of shadows
                this.player1.clickCard(this.penny);
            });

            it('allows the card to be brought out of shadows', function () {
                expect(this.penny.location).toBe('play area');
            });

            it('costs the printed shadow cost of the card', function () {
                // 9 gold from plot - 5 to bring tyrion out of shadows - 1 to bring Penny out of shadows for printed shadow cost
                expect(this.player1Object.gold).toBe(3);
            });
        });

        describe('when putting a Shadow card into shadows with a lower printed cost than the printed shadow cost', function () {
            beforeEach(function () {
                const deck = this.buildDeck('lannister', [
                    'Fealty',
                    'Banner of the Kraken',
                    'Late Summer Feast',
                    'Moqorro (DitD)',
                    'Tyrion Lannister (TB)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.tyrionLannister = this.player1.findCardByName('Tyrion Lannister', 'hand');
                this.moqorro = this.player1.findCardByName('Moqorro', 'hand');

                this.player1.clickCard(this.tyrionLannister);
                this.player1.clickPrompt('Setup in shadows');
                this.player1.clickCard(this.moqorro);
                this.player1.clickPrompt('Setup');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                //trigger tyrion
                this.player1.clickCard(this.tyrionLannister);
                this.player1.triggerAbility(this.tyrionLannister);
                this.player1.clickCard(this.moqorro);

                // Attempt to bring the card out of shadows
                this.player1.clickCard(this.moqorro);
            });

            it('allows the card to be brought out of shadows', function () {
                expect(this.moqorro.location).toBe('play area');
            });

            it('costs the printed cost of the card', function () {
                // 9 gold from plot - 5 to bring tyrion out of shadows - 3 to bring Penny out of shadows for printed shadow cost
                expect(this.player1Object.gold).toBe(1);
            });
        });
    });
});
