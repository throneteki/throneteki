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

    describe('while deciding whether to keep the starting hand', function () {
        integration(function () {
            beforeEach(function () {
                const deck = this.buildDeck('stark', ['A Noble Cause', 'Winterfell Steward']);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
            });

            it('does not mark which cards can be set up', function () {
                const state = this.game.getState(this.player1.player.name);
                const hand = state.players[this.player1.player.name].cardPiles.hand;

                expect(this.player1).toHavePrompt('Keep Starting Hand?');
                expect(hand.length).toBeGreaterThan(0);
                expect(hand.every((card) => card.canPlay === undefined)).toBe(true);
            });
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

    describe('placing setup cards', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'setup',
                player1: {
                    hand: [
                        'Eddard Stark (Core)',
                        'Northern Refugee',
                        'Valyrian Steel Dagger',
                        'Hedge Knight'
                    ]
                }
            });
        });

        it('does not pay for setup cards until setup is done', function () {
            this.player1.clickCard(this.eddardStark);

            expect(this.eddardStark.location).toBe('play area');
            expect(this.player1Object.gold).toBe(8);
            expect(this.player1Object.currentPrompt().promptTitle).toBe('1 gold left');
        });

        it('does not allow more than 8 gold of setup cards', function () {
            this.player1.clickCard(this.eddardStark);
            this.player1.clickCard(this.hedgeKnight);

            expect(this.hedgeKnight.location).toBe('hand');
        });

        it('returns a setup card to hand when it is clicked before setup is done', function () {
            this.player1.clickCard(this.eddardStark);
            this.player1.clickCard(this.eddardStark);

            expect(this.eddardStark.location).toBe('hand');
            expect(this.player1Object.currentPrompt().promptTitle).toBe('8 gold left');

            this.player1.clickCard(this.hedgeKnight);
            this.player1.clickCard(this.northernRefugee);

            expect(this.hedgeKnight.location).toBe('play area');
            expect(this.northernRefugee.location).toBe('play area');
        });

        it('does not log anything until setup is done', function () {
            const log = this.game.getPlainTextLog();

            this.player1.clickCard(this.eddardStark);
            this.player1.clickCard(this.eddardStark);
            this.player1.clickCard(this.northernRefugee);

            expect(this.game.getPlainTextLog()).toBe(log);
        });

        it('does not allow setup cards to change once setup is done', function () {
            this.player1.clickCard(this.northernRefugee);
            this.player1.clickPrompt('Done');

            this.player1.clickCard(this.northernRefugee);
            this.player1.clickCard(this.hedgeKnight);

            expect(this.northernRefugee.location).toBe('play area');
            expect(this.hedgeKnight.location).toBe('hand');
        });

        it('does not allow setup to finish with an attachment that has no target', function () {
            this.player1.clickCard(this.valyrianSteelDagger);

            expect(this.player1).not.toHavePromptButton('Done');

            this.player1.clickCard(this.northernRefugee);
            this.completeSetup();
            this.player1.clickCard(this.valyrianSteelDagger);
            this.player1.clickCard(this.northernRefugee);
            this.player1.clickPrompt('Done');

            expect(this.northernRefugee.attachments).toContain(this.valyrianSteelDagger);
            expect(this.player1).toHavePrompt('Select a plot');
        });
    });
});
