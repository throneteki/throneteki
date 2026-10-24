describe('Grey Wind (FtR)', function () {
    beforeEach(function () {
        this.setupTest({
            firstPlayer: 'player2',
            player1: {
                inPlay: [
                    { card: 'Robb Stark (Core)', attachments: ['Grey Wind (FtR)'] },
                    'Arya Stark (Core)'
                ],
                gold: 1
            },
            player2: { hand: ['Littlefinger (Core)'], gold: 5 }
        });
    });

    it('gives the attached character stealth', function () {
        expect(this.robbStark.hasKeyword('stealth')).toBe(true);
    });

    it("returns a Direwolf card to your hand to cancel an opponent's triggered character ability", function () {
        this.player2.clickCard(this.littlefinger);
        this.player2.triggerAbility('Littlefinger');
        this.player1.triggerAbility('Grey Wind');
        this.player1.clickCard(this.greyWind);
        expect(this.greyWind.location).toBe('hand');
        expect(this.player2Object.hand.length).toBe(0);
    });

    it('pays 1 gold to attach Grey Wind to a different unique Stark character', function () {
        this.player2.clickPrompt('Done');
        this.player1.clickMenu(this.greyWind, 'Attach Greywind to another character');
        this.player1.clickCard(this.aryaStark);
        expect(this.greyWind.parent).toBe(this.aryaStark);
        expect(this.player1Object.gold).toBe(5);
    });
});
