describe('Anya Waynwood', function () {
    describe('with Harry the Heir', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { inPlay: ['Anya Waynwood', 'Harry the Heir'] }
            });
        });

        it('gives him renown', function () {
            expect(this.harryTheHeir.hasKeyword('Renown')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('contributing STR', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    power: 1,
                    inPlay: [
                        'Anya Waynwood',
                        'Lannisport Merchant',
                        'Lannisport Merchant',
                        'The Kingsroad'
                    ]
                },
                player2: {
                    power: 1,
                    inPlay: [
                        'Anya Waynwood',
                        'Lannisport Merchant',
                        'Lannisport Merchant',
                        'Lannisport Merchant',
                        'The Kingsroad'
                    ]
                }
            });
            this.anya = this.player1.findCardByName('Anya Waynwood', 'play area');
            this.location = this.player1.findCardByName('The Kingsroad', 'play area');
            [this.merchant1] = this.player1.filterCardsByName('Lannisport Merchant', 'play area');
            this.opponentAnya = this.player2.findCardByName('Anya Waynwood', 'play area');
            this.opponentLocation = this.player2.findCardByName('The Kingsroad', 'play area');
            [this.opponentMerchant1, this.opponentMerchant2, this.opponentMerchant3] =
                this.player2.filterCardsByName('Lannisport Merchant', 'play area');
            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.merchant1);
            this.player1.clickPrompt('Done');
        });

        it('kneels a neutral location to have a non-participating character contribute its STR', function () {
            this.skipActionWindow();
            this.player2.clickCard(this.opponentMerchant1);
            this.player2.clickCard(this.opponentMerchant2);
            this.player2.clickPrompt('Done');
            this.player1.clickMenu(this.anya, 'Contribute STR to challenge');
            this.player1.clickCard(this.location);
            this.player1.clickCard(this.opponentMerchant3);
            this.player2.clickPrompt('Pass');
            this.player1.clickPrompt('Pass');

            expect(this.location.kneeled).toBe(true);
            expect(this.player1Object.faction.power).toBe(2);
            expect(this.player2Object.faction.power).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('is overridden when the opponent declares that character as a defender', function () {
            this.player1.clickMenu(this.anya, 'Contribute STR to challenge');
            this.player1.clickCard(this.location);
            this.player1.clickCard(this.opponentMerchant1);
            this.player2.clickPrompt('Pass');
            this.player1.clickPrompt('Pass');
            this.player2.clickCard(this.opponentMerchant1);
            this.player2.clickCard(this.opponentMerchant2);
            this.player2.clickPrompt('Done');
            this.skipActionWindow();

            expect(this.location.kneeled).toBe(true);
            expect(this.player1Object.faction.power).toBe(1);
            expect(this.player2Object.faction.power).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('uses the last effect when used twice on the same character', function () {
            this.player1.clickMenu(this.anya, 'Contribute STR to challenge');
            this.player1.clickCard(this.location);
            this.player1.clickCard(this.opponentMerchant2);
            this.player2.clickMenu(this.opponentAnya, 'Contribute STR to challenge');
            this.player2.clickCard(this.opponentLocation);
            this.player2.clickCard(this.opponentMerchant2);
            this.skipActionWindow();
            this.player2.clickCard(this.opponentMerchant1);
            this.player2.clickPrompt('Done');
            this.skipActionWindow();

            expect(this.location.kneeled).toBe(true);
            expect(this.player1Object.faction.power).toBe(1);
            expect(this.player2Object.faction.power).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
