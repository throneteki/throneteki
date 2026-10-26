describe('Shagwell', function () {
    function setup(context, sourceGold) {
        context.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [
                    { card: 'Shagwell (HMW)', gold: 1 },
                    { card: 'Jinglebell (HMW)', gold: 1 },
                    { card: 'Maester Wendamyr', gold: sourceGold },
                    'House Maester'
                ]
            },
            player2: {
                inPlay: ['Jinglebell (ToJ)']
            }
        });

        context.fool = context.player1.findCardByName('Jinglebell (HMW)');
        context.opponentFool = context.player2.findCardByName('Jinglebell (ToJ)');
    }

    describe('while a character with gold has a keyword', function () {
        beforeEach(function () {
            setup(this, 1);
        });

        it('gives that keyword to each Fool character with gold', function () {
            expect(this.shagwell.hasKeyword('stealth')).toBe(true);
            expect(this.fool.hasKeyword('stealth')).toBe(true);
            expect(this.fool.isBestow()).toBe(true);
            expect(this.houseMaester.hasKeyword('stealth')).toBe(false);
            expect(this.houseMaester.isBestow()).toBe(false);
            expect(this.opponentFool.hasKeyword('stealth')).toBe(false);
            expect(this.opponentFool.isBestow()).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while the character with the keyword has no gold', function () {
        beforeEach(function () {
            setup(this, 0);
        });

        it('does not give the keyword to Fool characters', function () {
            expect(this.shagwell.hasKeyword('stealth')).toBe(false);
            expect(this.fool.hasKeyword('stealth')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while the Fool character has no gold', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: ['Shagwell (HMW)', { card: 'Maester Wendamyr', gold: 1 }]
                }
            });
        });

        it('does not gain the keyword', function () {
            expect(this.shagwell.hasKeyword('stealth')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});

describe('Shagwell with a character made a Fool', function () {
    it('gives it the keywords of characters with gold', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Shagwell (HMW)', gold: 1 },
                    { card: 'Arya Stark (Core)', gold: 1 },
                    { card: 'Kindly Man', gold: 1 }
                ],
                hand: ['"Florian and Jonquil" (BtB)'],
                gold: 1
            }
        });
        this.player1.clickCard(this.florianAndJonquil);
        this.player1.clickCard(this.kindlyMan);

        expect(this.kindlyMan.hasTrait('Fool')).toBe(true);
        expect(this.kindlyMan.hasKeyword('stealth')).toBe(true);
        expect(this.shagwell.hasKeyword('renown')).toBe(true);
    });
});
