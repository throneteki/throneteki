describe('setup', function () {
    integration(function () {
        beforeEach(function () {
            const stark = this.buildDeck('stark', ['A Noble Cause', 'Hedge Knight']);
            const baratheon = this.buildDeck('baratheon', ['A Noble Cause', 'Hedge Knight']);
            this.player1.selectDeck(stark);
            this.player2.selectDeck(baratheon);
            this.startGame();
        });

        it('chooses the first player, then announces factions in that order', function () {
            const log = this.game.getPlainTextLog();
            const firstPlayerAt = log.indexOf('randomly selected to be first player');
            const announcedAt = log.indexOf('announces they are playing');

            expect(firstPlayerAt).toBeGreaterThan(-1);
            expect(announcedAt).toBeGreaterThan(firstPlayerAt);

            const firstPlayer = log.match(/(\w+) has been randomly selected to be first player/)[1];
            const firstAnnouncement = log.match(/(\w+) announces they are playing as/)[1];
            expect(firstAnnouncement).toBe(firstPlayer);
            expect(this.player1).toHavePrompt('Keep Starting Hand?');
        });
    });

    describe('abilities that resolve after all agendas are announced', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'setup',
                player1: {
                    agenda: 'The House With the Red Door',
                    deck: ['The Crag (TSoW)']
                },
                player2: {
                    agenda: 'The House With the Red Door',
                    deck: ['Riverrun']
                },
                beforeMulligan() {
                    const firstPlayer = this.game.getFirstPlayer();
                    const other = firstPlayer === this.player1Object ? this.player2 : this.player1;
                    const first = firstPlayer === this.player1Object ? this.player1 : this.player2;

                    expect(first).toHavePrompt('Choose which effect resolves next');
                    expect(other).toHavePrompt(
                        'Waiting for first player to choose the order of effects'
                    );

                    first.clickPrompt(`${other.name} - The House With the Red Door`);
                    this.resolvedFirst = other;
                    other.clickCard(other === this.player1 ? this.theCrag : this.riverrun);
                    first.clickCard(first === this.player1 ? this.theCrag : this.riverrun);
                }
            });
        });

        it('resolve in the order the first player chooses, before setup hands are drawn', function () {
            const log = this.game.getPlainTextLog();
            const otherLocation = this.resolvedFirst === this.player1 ? 'The Crag' : 'Riverrun';

            expect(this.theCrag.location).toBe('play area');
            expect(this.riverrun.location).toBe('play area');
            expect(log.indexOf(`puts ${otherLocation} into play`)).toBeLessThan(
                log.indexOf(
                    otherLocation === 'The Crag'
                        ? 'puts Riverrun into play'
                        : 'puts The Crag into play'
                )
            );
            expect(log.indexOf('puts Riverrun into play')).toBeLessThan(
                log.indexOf('has kept their hand')
            );
        });
    });

    describe('a mulligan', function () {
        integration(function () {
            beforeEach(function () {
                const deck = this.buildDeck('stark', [
                    'A Noble Cause',
                    'The House With the Red Door',
                    'The Crag (TSoW)',
                    { name: 'Winterfell Steward', count: 10 }
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(this.buildDeck('stark', ['A Noble Cause']));
                this.startGame();

                this.crag = this.player1.findCardByName('The Crag', 'draw deck');
                this.player1.clickCard(this.crag);
                this.player1.clickPrompt('Mulligan');
            });

            it('shuffles the setup hand back but leaves cards already in play', function () {
                expect(this.crag.location).toBe('play area');
                expect(this.player1Object.hand).toHaveLength(7);
            });
        });
    });
});
