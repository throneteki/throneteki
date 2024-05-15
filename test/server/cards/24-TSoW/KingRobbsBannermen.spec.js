describe("King Robb's Bannermen", function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('stark', [
                'Trading with the Pentoshi',
                "King Robb's Bannermen",
                'Robb Stark (AtSK)',
                "Brynden's Outriders",
                'The Horn of Winter'
            ]);
            const deck2 = this.buildDeck('targaryen', [
                'Trading with the Pentoshi',
                'The Wall (TMoW)',
                'House of the Undying',
                'The Great Pyramid',
                'The Roseroad'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.bannermen = this.player1.findCardByName("King Robb's Bannermen");
            this.robb = this.player1.findCardByName('Robb Stark (AtSK)');
            this.outriders = this.player1.findCardByName("Brynden's Outriders");
            this.horn = this.player1.findCardByName('The Horn of Winter');
            this.wall = this.player2.findCardByName('The Wall (TMoW)');
            this.undying = this.player2.findCardByName('House of the Undying');
            this.pyramid = this.player2.findCardByName('The Great Pyramid');
            this.roseroad = this.player2.findCardByName('The Roseroad');

            this.player1.clickCard(this.bannermen);
            this.player1.clickCard(this.outriders);
            this.player2.clickCard(this.wall);
            this.player2.clickCard(this.roseroad);

            this.completeSetup();

            this.selectFirstPlayer(this.player1);
            this.selectPlotOrder(this.player1);

            this.player1.clickCard(this.robb);
            this.player1.clickCard(this.horn);
            this.player1.clickCard(this.robb);
            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.undying);
            this.player2.clickCard(this.pyramid);
            this.player2.clickPrompt('Done');
        });

        describe("when King Robb's Bannermen attacks alone", function () {
            beforeEach(function () {
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.bannermen);
                this.player1.clickPrompt('Done');
            });
            it("should ask for up to 2 assault targets for King Robb's Bannermen", function () {
                expect(this.player1).toHavePrompt(
                    "Select up to 2 assault targets for King Robb's Bannermen"
                );
            });
            it('should allow you to target locations with printed cost 5 or lower for assault', function () {
                expect(this.player1).toAllowSelect(this.pyramid);
                expect(this.player1).toAllowSelect(this.roseroad);
                expect(this.player1).not.toAllowSelect(this.wall);
                expect(this.player1).not.toAllowSelect(this.undying);
            });
            it('should allow you to target two locations for assault', function () {
                this.player1.clickCard(this.pyramid);
                expect(this.player1).toAllowSelect(this.roseroad);
                expect(this.player1).not.toAllowSelect(this.wall);
                expect(this.player1).not.toAllowSelect(this.undying);
            });
        });

        describe("when King Robb's Bannermen attacks along with a higher printed cost assault character", function () {
            beforeEach(function () {
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.bannermen);
                this.player1.clickCard(this.robb);
                this.player1.clickPrompt('Done');
            });
            it('should ask for a single assault target for the higher cost character first', function () {
                expect(this.player1).toHavePrompt('Select assault target for Robb Stark');
            });
            it("should ask for a single assault target for King Robb's Bannermen second", function () {
                this.player1.clickCard(this.wall);
                expect(this.player1).toHavePrompt(
                    "Select assault target for King Robb's Bannermen"
                );
            });
            it('should allow you to target two locations for assault after first character targets none', function () {
                this.player1.clickPrompt('Done');
                this.player1.clickCard(this.pyramid);
                expect(this.player1).toAllowSelect(this.roseroad);
                expect(this.player1).not.toAllowSelect(this.wall);
                expect(this.player1).not.toAllowSelect(this.undying);
            });
            it('should allow you to only target one location for assault after first character targets one', function () {
                this.player1.clickCard(this.wall);
                this.player1.clickCard(this.pyramid);
                expect(this.player1).not.toAllowSelect(this.roseroad);
                expect(this.player1).not.toAllowSelect(this.wall);
                expect(this.player1).not.toAllowSelect(this.undying);
            });
        });

        describe("when King Robb's Bannermen attacks along with a lower printed cost assault character", function () {
            beforeEach(function () {
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.bannermen);
                this.player1.clickCard(this.outriders);
                this.player1.clickPrompt('Done');
            });
            it("should ask for up to 2 assault targets for King Robb's Bannermen first", function () {
                expect(this.player1).toHavePrompt(
                    "Select up to 2 assault targets for King Robb's Bannermen"
                );
            });

            describe('and you select two assault targets', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.pyramid);
                    this.player1.clickCard(this.roseroad);
                    this.player1.clickPrompt('Done');
                });

                it('should not ask for the lower printed cost assault target', function () {
                    expect(this.player1).not.toHavePrompt(
                        "Select assault target for Brynden's Outriders"
                    );
                });
            });

            describe('and you select one assault target', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.pyramid);
                    this.player1.clickPrompt('Done');
                });

                it('should ask for a single assault target for the lower cost character second', function () {
                    expect(this.player1).toHavePrompt(
                        "Select assault target for Brynden's Outriders"
                    );
                    expect(this.player1).toAllowSelect(this.roseroad);
                    expect(this.player1).not.toAllowSelect(this.wall);
                    expect(this.player1).not.toAllowSelect(this.undying);
                });
            });

            describe('and you select no assault targets', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Done');
                });

                it('should ask for a single assault target for the lower cost character second', function () {
                    expect(this.player1).toHavePrompt(
                        "Select assault target for Brynden's Outriders"
                    );
                    expect(this.player1).toAllowSelect(this.roseroad);
                    expect(this.player1).not.toAllowSelect(this.wall);
                    expect(this.player1).not.toAllowSelect(this.undying);
                });
            });
        });
    });
});
