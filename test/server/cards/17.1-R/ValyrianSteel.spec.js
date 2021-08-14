describe('Valyrian Steel', function () {
    integration(function () {
        describe('when an attachment enters play', function () {
            beforeEach(function () {
                const deck = this.buildDeck('lannister', [
                    'Valyrian Steel (R)',
                    'Late Summer Feast',
                    'Hedge Knight',
                    'Little Bird (Core)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Hedge Knight', 'hand');
                this.attachment = this.player1.findCardByName('Little Bird', 'hand');

                this.player1.clickCard(this.character);

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.player1.clickCard(this.attachment);
                this.player1.clickCard(this.character);
            });

            it('allows it to trigger', function () {
                expect(this.player1).toAllowAbilityTrigger('Valyrian Steel');
            });
        });

        describe('vs Risen from the Sea', function () {
            beforeEach(function () {
                const deck = this.buildDeck('lannister', [
                    'Valyrian Steel (R)',
                    'Valar Morghulis',
                    'A Noble Cause',
                    'Theon Greyjoy (Core)',
                    'Risen from the Sea'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Theon Greyjoy', 'hand');

                this.player1.clickCard(this.character);

                this.completeSetup();

                this.player1.selectPlot('Valar Morghulis');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.player1.clickCard('Risen from the Sea', 'hand');
            });

            it('allows it to trigger', function () {
                expect(this.player1).toAllowAbilityTrigger('Valyrian Steel');
            });
        });

        describe('vs Water Gardens', function() {
            beforeEach(function() {
                const deck = this.buildDeck('lannister', [
                    'Valyrian Steel (R)',
                    'A Noble Cause', 'A Storm of Swords', 'Valar Morghulis',
                    'Hedge Knight', 'Little Bird', 'The Water Gardens'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Hedge Knight', 'hand');
                this.attachment = this.player1.findCardByName('Little Bird', 'hand');
                this.waterGardens = this.player1.findCardByName('The Water Gardens', 'hand');

                this.player1.clickCard(this.character);
                this.player1.clickCard(this.waterGardens);

                this.completeSetup();

                const plot = this.player1.findCardByName('A Storm of Swords');
                this.player1.dragCard(plot, 'revealed plots');

                this.player1.selectPlot('A Noble Cause');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.player1.clickCard(this.waterGardens);
                this.player1.clickMenu('Valyrian Steel', 'Put attachment into play');
                this.player1.selectValue(1);
                this.player1.clickCard(this.attachment);
                this.player1.clickCard(this.character);
            });

            it('does not reduce the cost', function() {
                expect(this.player1Object.gold).toBe(4);
                expect(this.character.attachments).toContain(this.attachment);
            });
        });
    });
});
