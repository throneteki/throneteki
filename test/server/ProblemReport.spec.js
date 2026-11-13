import { MaxDescriptionLength } from '../../server/game/ProblemReport.js';

describe('problem reports', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'martell', inPlay: ['Starfall', 'Tumblestone Knight'] },
            player2: { inPlay: ['Burned Men'] }
        });
    });

    describe('while an ability is choosing its target', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.starfall);
            this.report = this.game.getProblemReport(
                'player1',
                'report',
                '  Starfall will not let me cancel  '
            );
            this.reportPlayer = (name) =>
                this.report.players.find((player) => player.name === name);
        });

        it("stores the reporter's description", function () {
            expect(this.report.schemaVersion).toBe(2);
            expect(this.report.description).toBe('Starfall will not let me cancel');
        });

        it('records the ability that is resolving', function () {
            expect(this.report.abilityStack).toEqual([
                expect.objectContaining({
                    player: 'player1',
                    source: { id: this.starfall.uuid, name: 'Starfall' }
                })
            ]);
        });

        it("records each player's open prompt and the cards they can select", function () {
            const prompt = this.reportPlayer('player1').prompt;

            expect(prompt.menuTitle).not.toBe('');
            expect(prompt.selectableCards).toContain(this.burnedMen.uuid);
            expect(prompt.selectableCards).toContain(this.tumblestoneKnight.uuid);
            expect(this.reportPlayer('player2').prompt.selectableCards).toEqual([]);
        });

        it('records the challenge in progress and whose challenge turn it is', function () {
            expect(this.report.game.challengeTurn).toEqual({
                activePlayer: 'player1',
                remainingPlayers: ['player1', 'player2'],
                finishedPlayers: []
            });
            expect(this.report.game.currentChallenge.attackers).toEqual([
                this.tumblestoneKnight.uuid
            ]);
        });

        it("records each player's prompt settings", function () {
            expect(this.reportPlayer('player1').settings).toEqual(
                expect.objectContaining({
                    promptedActionWindows: expect.any(Object),
                    hideInterrupts: expect.any(Boolean),
                    hideReactions: expect.any(Boolean),
                    responsesPausedForPhase: false
                })
            );
        });

        it("records each card's current state", function () {
            const knight = this.report.cards.find(
                (card) => card.id === this.tumblestoneKnight.uuid
            );

            expect(knight).toEqual(
                expect.objectContaining({
                    name: 'Tumblestone Knight',
                    location: 'play area',
                    participating: true,
                    strength: this.tumblestoneKnight.getStrength()
                })
            );
        });
    });

    it('records the players who have finished their challenges', function () {
        this.player1.clickPrompt('Done');

        const report = this.game.getProblemReport('player2');

        expect(report.game.challengeTurn).toEqual({
            activePlayer: 'player2',
            remainingPlayers: ['player2'],
            finishedPlayers: ['player1']
        });
        expect(report.description).toBe('');
    });

    it('limits the length of the description', function () {
        const report = this.game.getProblemReport('player1', 'report', 'x'.repeat(5000));

        expect(report.description).toHaveLength(MaxDescriptionLength);
    });

    it('takes the description from the Report Problem command', function () {
        const report = this.game.commands.reportProblem('player1', 'Something broke');

        expect(report.description).toBe('Something broke');
        expect(report.reporter).toBe('player1');
    });
});

describe('problem report ability log', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'martell', inPlay: ['Dornish Fiefdom'] }
        });
        this.player1.clickCard(this.dornishFiefdom);
        this.report = this.game.getProblemReport('player1');
    });

    it('records ability results as plain data that can be saved', function () {
        const entry = this.report.abilityLog.find(
            (logEntry) => logEntry.source?.name === 'Dornish Fiefdom'
        );

        expect(entry.results).toContainEqual(
            expect.objectContaining({ player: 'player1', amount: expect.any(Number) })
        );
        expect(() => JSON.stringify(this.report)).not.toThrow();
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('problem reports from a broken game', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Hedge Knight'] }
        });
        this.player1Object.getSelectableCards = () => {
            throw new Error('broken selection');
        };
    });

    it('records the part that failed and keeps the rest', function () {
        const report = this.game.getProblemReport('player1');

        expect(report.captureErrors).toEqual([
            { part: 'players.player1.prompt', message: 'broken selection' }
        ]);
        expect(report.players.map((player) => player.name)).toEqual(['player1', 'player2']);
        expect(report.cards.length).toBeGreaterThan(0);
        expect(() => JSON.stringify(report)).not.toThrow();
    });
});

describe('describing a problem report', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal' });
    });

    it('returns the description for the game server to send with the report ID', function () {
        expect(this.game.commands.describeProblem('player1', '  It broke  ')).toEqual({
            reporter: 'player1',
            description: 'It broke'
        });
    });

    it('ignores players who are not in the game', function () {
        expect(this.game.commands.describeProblem('nobody', 'It broke')).toBeUndefined();
    });
});
