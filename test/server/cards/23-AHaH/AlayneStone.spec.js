describe('Alayne Stone', function () {
    describe('when she enters play while you control Sansa Stark', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: ['Sansa Stark (WotN)'],
                    hand: ['Alayne Stone']
                }
            });

            this.player1.clickCard(this.alayneStone);
        });

        it('places her on Sansa Stark as a duplicate', function () {
            expect(this.alayneStone.location).toBe('duplicate');
            expect(this.sansaStark.dupes).toContain(this.alayneStone);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 places Alayne Stone on Sansa Stark as a duplicate'
            );
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when Sansa Stark enters play while Alayne Stone is in play', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: [
                        { card: 'Alayne Stone', power: 2, attachments: ['Little Bird (Core)'] }
                    ],
                    hand: ['Sansa Stark (WotN)']
                }
            });

            this.player1.clickCard(this.sansaStark);
        });

        it('places her on Sansa Stark without leaving play', function () {
            expect(this.alayneStone.location).toBe('duplicate');
            expect(this.sansaStark.dupes).toContain(this.alayneStone);
            expect(this.alayneStone.power).toBe(2);
            expect(this.player1Object.getTotalPower()).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('discards her attachments', function () {
            expect(this.littleBird.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when an opponent controls Sansa Stark', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    hand: ['Alayne Stone']
                },
                player2: {
                    inPlay: ['Sansa Stark (WotN)']
                }
            });

            this.player1.clickCard(this.alayneStone);
        });

        it('stays in play', function () {
            expect(this.alayneStone.location).toBe('play area');
            expect(this.sansaStark.dupes).not.toContain(this.alayneStone);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('during the challenges phase', function () {
        function setup(context, { kneeling, faction }) {
            context.setupTest({
                phase: 'challenge',
                player1: {
                    faction,
                    inPlay: ['Bran Stark (Core)', 'Dacey Mormont']
                },
                player2: {
                    gold: 1,
                    inPlay: [{ card: 'Alayne Stone', kneeling }],
                    hand: ['Nightmares']
                }
            });

            context.player1.clickPrompt('Done');
            context.player2.clickCard(context.nightmares);
            context.player2.clickCard(context.daceyMormont);
        }

        it('stops abilities on in-faction Lord or Lady characters while she is kneeling', function () {
            setup(this, { kneeling: true, faction: 'stark' });

            expect(this.player1).not.toAllowAbilityTrigger(this.branStark);
            expect(this.daceyMormont.hasKeyword('renown')).toBe(false);
            expect(this.player2).isReadyToTakeAction();
        });

        it('does not stop abilities while she is standing', function () {
            setup(this, { kneeling: false, faction: 'stark' });

            expect(this.player1).toAllowAbilityTrigger(this.branStark);
            this.player1.clickPrompt('Pass');
            expect(this.player2).isReadyToTakeAction();
        });

        it('does not stop abilities on out-of-faction characters', function () {
            setup(this, { kneeling: true, faction: 'lannister' });

            expect(this.player1).toAllowAbilityTrigger(this.branStark);
            this.player1.clickPrompt('Pass');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
