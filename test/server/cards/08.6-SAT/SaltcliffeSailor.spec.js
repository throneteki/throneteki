describe('Saltcliffe Sailor', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'Trading with the Pentoshi',
                inPlay: ['Tumblestone Knight'],
                hand: ['Saltcliffe Sailor', 'Wex Pyke']
            }
        });
    });

    it('does not gain stealth with no gold', function () {
        this.player1.clickCard(this.saltcliffeSailor);
        this.player1.clickPrompt('Done');

        expect(this.saltcliffeSailor.hasKeyword('Stealth')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });

    it('gains stealth with gold', function () {
        this.player1.clickCard(this.saltcliffeSailor);
        this.player1.clickPrompt('1');

        expect(this.saltcliffeSailor.hasKeyword('Stealth')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not give stealth to new characters with no gold', function () {
        this.player1.clickCard(this.saltcliffeSailor);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.wexPyke);
        this.player1.clickPrompt('Done');

        expect(this.wexPyke.hasKeyword('Stealth')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });

    it('gives stealth to new characters with gold', function () {
        this.player1.clickCard(this.saltcliffeSailor);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.wexPyke);
        this.player1.clickPrompt('1');

        expect(this.wexPyke.hasKeyword('Stealth')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });

    it('gives stealth to existing characters with gold', function () {
        this.player1.clickCard(this.wexPyke);
        this.player1.clickPrompt('1');
        this.player1.clickCard(this.saltcliffeSailor);
        this.player1.clickPrompt('Done');

        expect(this.wexPyke.hasKeyword('Stealth')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });

    it('moves 1 gold from itself to a non-greyjoy character you control', function () {
        this.player1.clickCard(this.saltcliffeSailor);
        this.player1.clickPrompt('1');
        this.player1.clickMenu(this.saltcliffeSailor, 'Move 1 gold to character');
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.saltcliffeSailor.gold).toBe(0);
        expect(this.tumblestoneKnight.gold).toBe(1);
        expect(this.tumblestoneKnight.hasKeyword('Stealth')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
